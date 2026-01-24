import mongoose from "mongoose";
import type { DbUser } from "@/api/user/user.type.js";

type ItemType = "card-back";
type Currency = "gem" | "gold";
type ShopItemStatus = "unavailable" | "available";

type DbItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	type: ItemType;
	name: string;
	description: string;
	icon: string;
	stackable: boolean;
	maxStack: number
};

type DbShopItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	baseItem: mongoose.Types.ObjectId | DbItem;

	currency: Currency;
	price: number;
	status: ShopItemStatus
};

type DbInventoryItem = {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	baseItem: mongoose.Types.ObjectId | DbItem;
	user: mongoose.Types.ObjectId | DbUser;

	amount: number
};

type DbShopItemFlatten = Pick<DbShopItem,
	"id" | "createdAt" | "updatedAt" |
	"currency" | "price" | "status"
> & Pick<DbItem,
	"type" | "name" | "description" | "icon"
>;

type ShopItemFilter = Partial<Pick<DbShopItem, "status" | "currency">>;

type CreateShopItemInput = Pick<DbItem,
	"type" | "name" | "description" | "icon" | "stackable"
> & Partial<Pick<DbItem,
	"maxStack"
>> & Pick<DbShopItem,
	"currency" | "price" | "status"
>;

type CreateShopItemResult = { id: string } & CreateShopItemInput;

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