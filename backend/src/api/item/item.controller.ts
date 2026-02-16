import type { RequestHandler } from "express";
import type {
	CreateShopItemResult,
	DbShopItemFlatten,
	GetInventoryItemsResult
} from "./item.type.js";
import {
	buyShopItem,
	createShopItem,
	getInventoryItems,
	getShopItems,
	isValidItemType
} from "./item.service.js";
import type { UpdatedUserCurrency } from "@/api/user/user.type.js";
import { deleteFile } from "@/util/util.js";
import { InvalidDataError, MissingFileError } from "@/util/error.js";
import type { UserRequest } from "@/util/request.js";

const getShopItemsController: RequestHandler = async (req, res) => {
	const userId = (req as UserRequest).user.id;
	const { type } = req.query;

	if (!isValidItemType(type))
		throw new InvalidDataError("type", type?.toString());

	const items: DbShopItemFlatten[] = await getShopItems(userId, type);
	res.status(200).json({ items });
}

const getShopItemsAdminController: RequestHandler = async (_, res) => {
	const items: DbShopItemFlatten[] = await getShopItems();
	res.status(200).json({ items });
}

const getInventoryItemsController: RequestHandler = async (req, res) => {
	const userId = (req as UserRequest).user.id;
	const { type } = req.query;

	if (!isValidItemType(type))
		throw new InvalidDataError("type", type?.toString());

	const inventoryItems: GetInventoryItemsResult[] = await getInventoryItems(userId, type);
	res.status(200).json({ inventoryItems });
}

const createShopItemAdminController: RequestHandler = async (req, res) => {
	if (!req.file)
		// Why not?
		throw new MissingFileError("icon");

	try {
		// NOTE:
		// If you perform checks, only check for types.
		// Let mongoose handle semantic checks
		// so it can return the correct HTTP status codes.
		const { type, name, description, currency, status } = req.body;
		const price = Number(req.body.price); // Mongoose will handle NaN.
		const quantity = Number(req.body.quantity);
		const icon = req.file.path;
		const stackable = req.body.stackable === "true";

		const itemData = stackable ? {
			type, name, description, icon, stackable, currency, price, quantity, status,
		} : {
			type, name, description, icon, stackable, currency, price, status,
		};

		const shopItem: CreateShopItemResult = await createShopItem(itemData);

		res.status(201).json({
			message: "Shop item created successfully.",
			item: shopItem
		});
	} catch (e) {
		await deleteFile(req.file.path);
		throw e;
	}
};

const buyShopItemController: RequestHandler = async (req, res) => {
	const updatedUserCurrency: UpdatedUserCurrency = await buyShopItem(
		req.body.shopItemId as string,
		(req as UserRequest).user.id
	);
	res.status(200).json({ message: "OK", updatedUserCurrency });
};

export {
	buyShopItemController,
	createShopItemAdminController,
	getInventoryItemsController,
	getShopItemsController,
	getShopItemsAdminController
};