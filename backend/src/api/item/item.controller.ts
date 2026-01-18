import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import { Item, ShopItem } from "@/api/item/item.model.js";
import type { DbItem, DbShopItem, DbShopItemFlatten } from "./item.type.js";
import { getShopItems } from "./item.service.js";

const getShopItemsController = async (_: Request, res: Response): Promise<void> => {
	try {
		const items: DbShopItemFlatten[] = await getShopItems({ status: "available" });
		res.status(200).json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(500).json({ message: msg });
	}
}

const getShopItemsAdminController = async (_: Request, res: Response): Promise<void> => {
	try {
		const items: DbShopItemFlatten[] = await getShopItems();
		res.status(200).json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(500).json({ message: msg });
	}
}

const createShopItemAdminController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { type, name, description, icon, currency, price } = req.body;
		const newItem: HydratedDocument<DbItem> = new Item({ name, type, description, icon });
		const savedItem = await newItem.save();
		const newShopItem: HydratedDocument<DbShopItem> = new ShopItem({
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
	createShopItemAdminController,
	getShopItemsController,
	getShopItemsAdminController
};