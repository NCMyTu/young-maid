import mongoose from "mongoose";
import { ShopItem, Item } from "./item.model.js";
import type {
	DbItem,
	ShopItemFilter,
	DbShopItemFlatten,
	CreateShopItemInput,
	CreateShopItemResult
} from "./item.type.js";

const getShopItems = async (
	filter?: ShopItemFilter
): Promise<DbShopItemFlatten[]> => {
	const queried = await ShopItem
		.find({ ...filter })
		.sort({ "createdAt": -1 })
		.populate<{ baseItem: DbItem }>("baseItem")
		.lean();

	const items: DbShopItemFlatten[] = queried.map(item => ({
		id: item._id.toString(),
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

	return items;
};

const createShopItem = async ({
	type,
	name,
	description,
	currency,
	price,
	icon,
	status,
	stackable
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
				status
			});
			await shopItem.save({ session });

			return {
				id: shopItem._id.toString(),
				type: item.type,
				name: item.name,
				description: item.description,
				icon: item.icon,
				currency: shopItem.currency,
				price: shopItem.price,
				status: shopItem.status,
				stackable: item.stackable
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
	getShopItems
};