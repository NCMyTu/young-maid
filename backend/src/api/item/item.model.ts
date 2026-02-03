import mongoose, { Model } from "mongoose";
import type { DbItem, DbShopItem, DbInventoryItem } from "./item.type.js";

//                                             redundant, but it aligns with the User model.
//                                             |
//                                             v
const itemSchema = new mongoose.Schema<DbItem, Model<DbItem>>({
	type: {
		type: String,
		enum: ["card-back", "card-face", "table-cloth"],
		trim: true,
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	description: {
		type: String,
		trim: true
	},
	icon: {
		type: String,
		trim: true,
		required: true
	},
	stackable: {
		type: Boolean,
		required: true
	}
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
		required: true,
		unique: true
	},
	currency: {
		type: String,
		trim: true,
		required: [true, "Item currency is required."],
		enum: ["gem", "gold"]
	},
	quantity: {
		type: Number,
		min: [1, "Item price must be at least 1."]
	},
	price: {
		type: Number,
		required: [true, "Item price is required."],
		min: [0, "Item price must be at least 0."]
	},
	status: {
		type: String,
		trim: true,
		enum: ["available", "unavailable"],
		default: "available"
	}
},
	{
		timestamps: true,
		optimisticConcurrency: true
	}
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
	},
	quantity: {
		type: Number,
		min: [1, "Item quantity must be at least 1."]
	}
},
	{ timestamps: true }
);

inventoryItemSchema.index(
	// TODO: May reverse index order later to better match left prefix rule.
	{ "baseItem": 1, "user": 1 },
	{ unique: true, name: "idx_u_baseItem_user" }
);

const Item = mongoose.model("Item", itemSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);
const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export {
	Item,
	ShopItem,
	InventoryItem
};