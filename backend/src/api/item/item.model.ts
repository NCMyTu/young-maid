import mongoose, { Model } from "mongoose";
import type { DbItem, DbShopItem, DbInventoryItem } from "./item.type.js";

//                                             redundant, but it aligns with the User model.
//                                             |
//                                             v
const itemSchema = new mongoose.Schema<DbItem, Model<DbItem>>({
	type: {
		type: String,
		enum: ["card-back"],
		required: [true, "Item type is required."]
	},
	name: {
		type: String,
		required: [true, "Item name is required."],
		trim: true,
		unique: true
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

//                                                     Same as above.
//                                                     |
//                                                     v
const shopItemSchema = new mongoose.Schema<DbShopItem, Model<DbShopItem>>({
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
	},
	status: {
		type: String,
		enum: ["available", "unavailable"],
		default: "available"
	}
},
	{ timestamps: true }
);

const inventoryItemSchema = new mongoose.Schema<DbInventoryItem, Model<DbInventoryItem>>({
	baseItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item",
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
},
	{ timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);
const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export {
	Item,
	ShopItem,
	InventoryItem
};