import mongoose from "mongoose";
import type { IItem, IInventoryItem, IShopItem } from "./item.type.js";

const ItemSchema = new mongoose.Schema<IItem>({
	name: {
		type: String,
		required: [true, "Item name is required."],
		trim: true,
		unique: true
	},
	type: {
		type: String,
		enum: ["card-back"],
		required: [true, "Item type is required."]
	},
	description: {
		type: String,
		required: [true, "Item description is required."],
		trim: true
	},
	icon: {
		type: String,
		required: [true, "Item icon path is required."]
	},
},
	{ timestamps: true }
);

const ShopItemSchema = new mongoose.Schema<IShopItem>({
	baseItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item",
		required: true
	},
	currency: {
		type: String,
		required: [true, "Item currency is required."],
		enum: ["gem", "gold"]
	},
	price: {
		type: Number,
		required: [true, "Item price is required."]
	}
},
	{ timestamps: true }
);

const InventoryItemSchema = new mongoose.Schema<IInventoryItem>({
	baseItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item",
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	acquiredDate: {
		type: Date,
		default: Date.now
	}
},
	{ timestamps: true }
);

const Item = mongoose.model<IItem>("Item", ItemSchema);
const InventoryItem = mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
const ShopItem = mongoose.model<IShopItem>("ShopItem", ShopItemSchema);

export default Item;
export {
	InventoryItem,
	ShopItem
}