import { ShopItem } from "./item.model.js";
import type { IItem, IShopItem } from "./item.type.js";

const getShopItems = async (
	filter?: Partial<Pick<IShopItem, "status" | "currency">>
) => {
	const queried = await ShopItem
		.find({ ...filter })
		.sort({ "createdAt": -1 })
		.populate<{ baseItem: IItem }>("baseItem")
		.lean();

	const items = queried.map(item => ({
		id: item._id.toString(),
		name: item.baseItem.name,
		type: item.baseItem.type,
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