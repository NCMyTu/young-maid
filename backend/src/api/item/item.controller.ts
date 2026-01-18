import type { Request, Response } from "express";
import mongoose, { type HydratedDocument } from "mongoose";
import { Item, ShopItem } from "@/api/item/item.model.js";
import type { DbItem, DbShopItem, DbShopItemFlatten } from "./item.type.js";
import { getShopItems } from "./item.service.js";
import { deleteFile } from "@/util/util.js";

const getShopItemsController = async (_: Request, res: Response): Promise<void> => {
	try {
		const items: DbShopItemFlatten[] = await getShopItems({ status: "available" });
		res.status(200).json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error.";
		res.status(500).json({ message: msg });
	}
}

const getShopItemsAdminController = async (_: Request, res: Response): Promise<void> => {
	try {
		const items: DbShopItemFlatten[] = await getShopItems();
		res.status(200).json({ items });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error.";
		res.status(500).json({ message: msg });
	}
}

const createShopItemAdminController = async (req: Request, res: Response): Promise<void> => {
	// TODO: if shop item fails to save, it creates orphaned.
	// use transaction
	if (!req.file) {
		// Why not?
		res.status(400).json({ message: "Icon file is required." });
		return;
	}

	try {
		const { type, name, description, currency, price } = req.body;
		const icon = req.file.path;

		const newItem: HydratedDocument<DbItem> = new Item({ type, name, description, icon });
		const savedItem = await newItem.save();
		const newShopItem: HydratedDocument<DbShopItem> = new ShopItem({
			baseItem: savedItem.id,
			currency,
			price
		});
		const savedShopItem = await newShopItem.save();

		const responseItem = {
			id: savedShopItem.id,
			type: savedItem.type,
			name: savedItem.name,
			description: savedItem.description,
			icon: savedItem.icon,
			currency: savedShopItem.currency,
			price: savedShopItem.price,
			status: savedShopItem.status
		};
		res.status(201).json({
			message: "Shop item created successfully.",
			item: responseItem
		});
	} catch (e) {
		deleteFile(req.file.path);

		if (e instanceof mongoose.Error.ValidationError)
			res.status(400).json({message: "Invalid input data."});
		else
			res.status(500).json({ message: "Unexpected error." });
	}
};

export {
	createShopItemAdminController,
	getShopItemsController,
	getShopItemsAdminController
};