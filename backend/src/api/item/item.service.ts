import { ShopItem } from "./item.model.js";
import type { DbItem, ShopItemFilter, DbShopItemFlatten } from "./item.type.js";

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

export {
	getShopItems
}