import mongoose from "mongoose";
import { ShopItem, Item, InventoryItem } from "./item.model.js";
import { type DbItem, ITEM_TYPES } from "./item.type.js";
import type {
	CreateShopItemInput,
	CreateShopItemResult,
	DbShopItemFlatten,
	GetInventoryItemsResult,
	ItemType
} from "./item.type.js";
import { User } from "@/api/user/user.model.js";
import { InternalInconsistencyError, PurchaseNotAllowedError, ResourceNotFoundError } from "@/util/error.js";
import type { UpdatedUserCurrency } from "@/api/user/user.type.js";

// TODO: make this generic!
const isValidItemType = (x: unknown): x is ItemType =>
	typeof x === "string" && ITEM_TYPES.includes(x as ItemType);

const getShopItems = async (userId?: string, type?: ItemType): Promise<DbShopItemFlatten[]> => {
	// TODO: add user-owned quantity.
	const queried = await ShopItem.aggregate([
		// Admin will need all statuses and no userId.
		{ $match: { status: "available" } },
		{ $sort: { createdAt: -1 } },
		{
			$lookup: {
				from: "items",
				localField: "baseItem",
				foreignField: "_id",
				as: "baseItem"
			}
		},
		{ $unwind: "$baseItem" },
		...(type ? [{ $match: { "baseItem.type": type } }] : []),
		{
			$lookup: {
				from: "inventoryitems",
				localField: "baseItem._id",
				foreignField: "baseItem",
				pipeline: [
					{ $match: { $expr: { $eq: ["$user", { $toObjectId: userId }] } } },
					{ $limit: 1 }
				],
				as: "inventoryMatch",
			}
		},
		{
			$addFields: {
				isOwnershipLocked: {
					$and: [
						{ $eq: ["$baseItem.stackable", false] },
						{ $gt: [{ $size: "$inventoryMatch" }, 0] }
					]
				}
			}
		},
		{ $unset: "inventoryMatch" }
	]).exec();

	const shopItems: DbShopItemFlatten[] = queried.map((item: any): DbShopItemFlatten => ({
		id: item._id.toString() as string,
		type: item.baseItem.type,
		name: item.baseItem.name,
		description: item.baseItem.description,
		icon: item.baseItem.icon,
		currency: item.currency,
		price: item.price,
		status: item.status,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		isOwnershipLocked: item.isOwnershipLocked
	}));

	return shopItems;
};

const getInventoryItems = async (userId: string, type?: ItemType): Promise<GetInventoryItemsResult[]> => {
	const inventoryItems: GetInventoryItemsResult[] = await Item.aggregate([
		...(type ? [{ $match: { type } }] : []),
		{
			$lookup: {
				from: "inventoryitems",
				localField: "_id",
				foreignField: "baseItem",
				pipeline: [
					{ $match: { $expr: { $eq: ["$user", { $toObjectId: userId }] } } },
				],
				as: "match",
			}
		},
		{ $unwind: "$match" },
		{ $sort: { "match.createdAt": -1 } },
		{
			$project: {
				_id: 0,
				type: 1,
				name: 1,
				description: 1,
				icon: 1,
				inventoryItemId: { $toString: "$match._id" },
				quantity: "$match.quantity",
			}
		}
	]).exec() as GetInventoryItemsResult[]; // Make sure this has correct fields before casting.

	return inventoryItems;
};

const createShopItem = async ({
	type,
	name,
	description,
	icon,
	stackable,
	currency,
	price,
	quantity,
	status
}: CreateShopItemInput): Promise<CreateShopItemResult> => {
	const session = await mongoose.startSession();

	try {
		const savedShopItem: CreateShopItemResult = await session.withTransaction(async () => {
			const item = new Item({
				type,
				name,
				description,
				// Stupid windows path separator...
				icon: icon.replaceAll("\\", "/"),
				stackable
			});
			await item.save({ session });

			const shopItem = new ShopItem({
				baseItem: item._id,
				currency,
				price,
				quantity,
				status
			});
			await shopItem.save({ session });

			return {
				id: shopItem.id as string,
				type: item.type,
				name: item.name,
				description: item.description,
				icon: item.icon,
				stackable: item.stackable,
				currency: shopItem.currency,
				price: shopItem.price,
				quantity: shopItem.quantity,
				status: shopItem.status
			};
		});

		return savedShopItem;
	} catch (e) {
		throw e;
	} finally {
		session.endSession();
	}
};

const buyShopItemWithSession = async (
	session: mongoose.mongo.ClientSession,
	shopItemId: string,
	userId: string
): Promise<UpdatedUserCurrency> => {
	// Validate shop item.
	const shopItem = await ShopItem
		.findById(shopItemId)
		.session(session)
		.populate<{ baseItem: DbItem }>("baseItem");

	if (!shopItem)
		throw new ResourceNotFoundError("shop item");
	if (!shopItem.baseItem)
		throw new ResourceNotFoundError("base item");

	// Validate user.
	const user = await User.findById(userId).session(session);
	if (!user)
		throw new ResourceNotFoundError("user");

	const { currency, quantity, price } = shopItem;

	if (user[currency] < price)
		throw new PurchaseNotAllowedError(`Not enough ${currency}`);

	const baseItem = shopItem.baseItem;
	const stackable = baseItem.stackable;

	// Update/Create inventory item.
	const existedInventoryItem = await InventoryItem.findOne({
		baseItem: baseItem.id,
		user: user.id
	}).session(session);

	if (!stackable) {
		if (existedInventoryItem) {
			throw new PurchaseNotAllowedError(`Item is not stackable and already owned`);
		} else {
			const newInventoryItem = new InventoryItem({
				baseItem: baseItem.id,
				user: user.id
			});
			await newInventoryItem.save({ session });
		}
	} else {
		if (!quantity || quantity < 1)
			throw new InternalInconsistencyError(
				`Stackable shop item (id: ${shopItemId}) must have quantity > 0`
			);

		if (existedInventoryItem) {
			if (!existedInventoryItem.quantity || existedInventoryItem.quantity < 1)
				throw new InternalInconsistencyError(
					`Stackable inventory item (id: ${existedInventoryItem.id}) must have quantity > 0`
				);

			existedInventoryItem.quantity += quantity;
			await existedInventoryItem.save({ session });
		} else {
			const newInventoryItem = new InventoryItem({
				baseItem: baseItem.id,
				user: user.id,
				quantity: quantity
			});
			await newInventoryItem.save({ session });
		}
	}

	user[currency] -= price;
	await user.save({ session });

	const updatedUserCurrency: UpdatedUserCurrency = {
		id: user.id,
		gold: user.gold,
		gem: user.gem
	};

	return updatedUserCurrency;
};

const buyShopItem = async (shopItemId: string, userId: string) => {
	const session = await mongoose.startSession();

	try {
		const updatedUserCurrency: UpdatedUserCurrency = await session.withTransaction(
			async () => (
				await buyShopItemWithSession(session, shopItemId, userId)
			)
		);
		return updatedUserCurrency;
	} catch (e) {
		throw e;
	} finally {
		session.endSession();
	}
};

export {
	buyShopItem,
	createShopItem,
	getInventoryItems,
	getShopItems,
	isValidItemType
};