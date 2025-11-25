import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import Item, { ShopItem } from "@/api/item/item.model.js";
import type { IItem, IShopItem } from "./item.type.js";

const getAllShopItemsController = async (_: Request, res: Response): Promise<void> => {
	try {
		const preprocessedItems = await ShopItem
			.find()
			.sort({ "createdAt": -1 })
			.populate<{ baseItem: IItem }>("baseItem");

		if (!preprocessedItems)
			throw new Error("No items found");

		const items = preprocessedItems.map(item => {
			return {
				id: item.id,
				name: item.baseItem.name,
				type: item.baseItem.type,
				description: item.baseItem.description,
				icon: item.baseItem.icon,
				currency: item.currency,
				price: item.price,
				createdAt: item.createdAt,
				updatedAd: item.updatedAt
			};
		});
		res.status(200).json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(500).json({ message: msg });
	}
}

const createShopItemController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, type, description, icon, currency, price } = req.body;
		const newItem: HydratedDocument<IItem> = new Item({ name, type, description, icon });
		const savedItem = await newItem.save();
		const newShopItem: HydratedDocument<IShopItem> = new ShopItem({
			baseItem: savedItem.id,
			currency,
			price
		});
		const savedShopItem = await newShopItem.save();
		res.status(201).json({
			message: "Shop item created successfully.",
			item: savedShopItem
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(409).json({ message: msg });
	}
};

export {
	createShopItemController,
	getAllShopItemsController
};