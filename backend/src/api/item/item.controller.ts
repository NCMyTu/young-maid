import type { Request, Response } from "express";
import mongoose from "mongoose";
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
	if (!req.file) {
		// Why not?
		res.status(400).json({ message: "Icon file is required." });
		return;
	}

	const session = await mongoose.startSession();

	try {
		const { type, name, description, currency } = req.body;
		const price = Number(req.body.price);
		const icon = req.file.path.replaceAll("\\", "/");

		const responseItem = await session.withTransaction(async () => {
			const item = new Item({ type, name, description, icon });
			await item.save({ session });
			const shopItem = new ShopItem({ baseItem: item._id, currency, price });
			await shopItem.save({ session });

			return {
				id: shopItem.id,
				type: item.type,
				name: item.name,
				description: item.description,
				icon: item.icon,
				currency: shopItem.currency,
				price: shopItem.price,
				status: shopItem.status
			};
		});

		res.status(201).json({
			message: "Shop item created successfully.",
			item: responseItem
		});
	} catch (e) {
		deleteFile(req.file.path);

		if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError)
			res.status(400).json({ message: "Invalid input data." });
		else
			res.status(500).json({ message: "Unexpected error." });
	} finally {
		await session.endSession();
	}
};

export {
	createShopItemAdminController,
	getShopItemsController,
	getShopItemsAdminController
};