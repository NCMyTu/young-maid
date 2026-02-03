import mongoose from "mongoose";
import { ShopItem, Item } from "./item.model.js";
import { ITEM_TYPES } from "./item.type.js";
import type {
	CreateShopItemInput,
	CreateShopItemResult,
	DbShopItemFlatten,
	ItemType,
} from "./item.type.js";

// TODO: make this generic!
const isValidItemType = (x: unknown): x is ItemType =>
	typeof x === "string" && ITEM_TYPES.includes(x as ItemType);

const getShopItemsByType = async (type?: ItemType): Promise<DbShopItemFlatten[]> => {
	// const preItems = (await Item.find({ ...filter }).lean()).map((e: any) => e._id);
	// const queried = await ShopItem.find({ baseItem: { $in: preItems }, status: "available" })
	// 	.sort({ "createdAt": -1 }).populate<{ baseItem: DbItem }>("baseItem").lean();

	// This is faster than the above, at least with 3 docs.
	const queried = await ShopItem.aggregate([
		// Admin will need all statuses.
		{ $match: { status: "available" } },
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
		{ $sort: { createdAt: -1 } }
	]).exec();

	const shopItems: DbShopItemFlatten[] = queried.map(item => ({
		id: item._id.toString() as string,
		type: item.baseItem.type,
		name: item.baseItem.name,
		description: item.baseItem.description,
		icon: item.baseItem.icon,
		currency: item.currency,
		price: item.price,
		status: item.status,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt
	}));

	return shopItems;
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
				id: shopItem._id.toString(),
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

export {
	createShopItem,
	getShopItemsByType,
	isValidItemType
};