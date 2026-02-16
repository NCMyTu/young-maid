export type ItemType = "card-back" | "card-face" | "table-cloth";

export const ITEM_TYPE_LABELS: Readonly<Record<ItemType, string>> = {
	"card-back": "Card Back",
	"card-face": "Card Face",
	"table-cloth": "Table Cloth"
};

export type InventoryItemResponse = {
	inventoryItemId: string;
	type: ItemType;
	name: string;
	description: string;
	icon: string;
	quantity?: number
};