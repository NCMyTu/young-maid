import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { CreateShopItemResult, DbShopItemFlatten } from "./item.type.js";
import { createShopItem, getShopItems } from "./item.service.js";
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

	try {
		// NOTE:
		// If you perform checks, only check for types.
		// Let mongoose handle semantic checks
		// so it can return the correct HTTP status codes.
		const { type, name, description, currency, status } = req.body;
		const price = Number(req.body.price); // Mongoose will handle NaN.
		const icon = req.file.path;
		const stackable = req.body.stackable === "true";

		const itemData = {
			type, name, description, currency, status, icon, price, stackable
		};

		const shopItem: CreateShopItemResult = await createShopItem(itemData);

		res.status(201).json({
			message: "Shop item created successfully.",
			item: shopItem
		});
	} catch (e) {
		deleteFile(req.file.path);

		if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError)
			res.status(400).json({ message: "Invalid input data." });
		else
			res.status(500).json({ message: "Unexpected error." });
	}
};

export {
	createShopItemAdminController,
	getShopItemsController,
	getShopItemsAdminController
};