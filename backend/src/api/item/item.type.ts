import mongoose from "mongoose";
import type { DbUser } from "@/api/user/user.type.js";

const ITEM_TYPES = ["card-back", "card-face", "table-cloth"] as const;
const CURRENCY = ["gem", "gold"] as const;
const SHOP_ITEM_STATUS = ["available", "unavailable"] as const;

type ItemType = typeof ITEM_TYPES[number];
type Currency = typeof CURRENCY[number];
type ShopItemStatus = typeof SHOP_ITEM_STATUS[number];

type DbItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	type: ItemType;
	name: string;
	description: string;
	icon: string;
	stackable: boolean
};

type DbShopItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	baseItem: mongoose.Types.ObjectId | DbItem;

	currency: Currency;
	price: number;
	quantity?: number;
	status: ShopItemStatus
};

type DbInventoryItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	baseItem: mongoose.Types.ObjectId | DbItem;
	user: mongoose.Types.ObjectId | DbUser;

	quantity?: number
};

type DbShopItemFlatten = Pick<DbShopItem,
	"id" | "createdAt" | "updatedAt" | "currency" | "price" | "status" | "quantity"
> & Pick<DbItem,
	"type" | "name" | "description" | "icon"
> & {
	isOwnershipLocked: boolean
};

type ShopItemFilter = Pick<DbItem, "type">;

type CreateShopItemInput = Pick<DbItem,
	"type" | "name" | "description" | "icon" | "stackable"
> & Pick<DbShopItem,
	"currency" | "price" | "quantity" | "status"
>;

type CreateShopItemResult = { id: string } & CreateShopItemInput;

export {
	ITEM_TYPES,
	CURRENCY,
	SHOP_ITEM_STATUS
};

export type {
	ItemType,
	Currency,
	ShopItemStatus,
	DbItem,
	DbShopItem,
	DbInventoryItem,
	ShopItemFilter,
	DbShopItemFlatten,
	CreateShopItemInput,
	CreateShopItemResult
};