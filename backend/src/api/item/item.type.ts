import { Document, Types } from "mongoose";
import type { IUser } from "@/api/user/user.type.js";

interface IItem extends Document {
	_id: Types.ObjectId,
	id: string,
	createdAt: Date,
	updatedAt: Date,

	type: "card-back",
	name: string,
	description: string,
	icon: string
}

interface IShopItem extends Document {
	_id: Types.ObjectId,
	id: string,
	createdAt: Date,
	updatedAt: Date,

	baseItem: Types.ObjectId | IItem,
	currency: "gem" | "gold",
	price: number,
	status: "unavailable" | "available"
}

interface IInventoryItem extends Document {
	_id: Types.ObjectId,
	id: string,
	createdAt: Date,
	updatedAt: Date,

	baseItem: Types.ObjectId | IItem,
	user: Types.ObjectId | IUser,
	acquiredDate: Date
}

export type {
	IItem,
	IShopItem,
	IInventoryItem,
};