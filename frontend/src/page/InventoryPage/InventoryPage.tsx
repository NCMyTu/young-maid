import React, { useEffect, useState } from "react";
import styles from "./InventoryPage.module.css";
import TopBar from "@/component/TopBar/TopBar";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";
import ResourceBadges from "@/component/TopBar/Group/ResourceBadges";
import { useShallow } from "zustand/shallow";
import useUser from "@/lib/store/user/user";
import InventoryItem from "@/component/InventoryItem/InventoryItem";
import ItemDetail from "./ItemDetail/ItemDetail";
import { API_BASE_URL, ENDPOINTS } from "@/config/endpoints";

// TODO: Cache the fetch result.

type ItemType = "card-back" | "card-face" | "table-cloth";
type InventoryItem = {
	inventoryItemId: string;
	type: ItemType;
	name: string;
	description: string;
	icon: string;
	quantity?: number;
}

const ITEM_TYPE_MAPPING: Readonly<Record<ItemType, string>> = {
	"card-back": "Card Back",
	"card-face": "Card Face",
	"table-cloth": "Table Cloth"
};

const handleSelectOnClick = (
	e: React.ChangeEvent<HTMLSelectElement>,
	setItemType: React.Dispatch<React.SetStateAction<ItemType>>
): void => {
	const value = e.target.value;
	if (value in ITEM_TYPE_MAPPING)
		setItemType(value as ItemType);
}

function InventoryPage(): React.JSX.Element {
	const [itemType, setItemType] = useState<ItemType>(Object.keys(ITEM_TYPE_MAPPING)[0]! as ItemType);
	const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
	const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
	const user = useUser(useShallow((state) => ({
		id: state.id,
		gold: state.gold,
		gem: state.gem
	})));

	useEffect(() => {
		// TODO: use AbortController
		const fetchInventoryItem = async () => {
			const url = `${ENDPOINTS.GET.inventoryItems}/?type=${itemType}`;
			const res = await fetch(url, {
				method: "GET",
				credentials: "include"
			});

			const inventoryItems: InventoryItem[] = (await res.json()).inventoryItems as InventoryItem[];
			setInventoryItems(inventoryItems);
			setSelectedInventoryItem(inventoryItems[0] ?? null);
		};

		fetchInventoryItem();
	}, [itemType]);

	return (
		<div className={styles.container} >
			<TopBar className={styles.topBar}>
				<BackButtonAndScreenName screenName="inventory" />
				<ResourceBadges gold={user.gold} gem={user.gem} />
			</TopBar>

			<div className={styles.primary}>
				{selectedInventoryItem && <>
					<img className={styles.itemIcon} src={`${API_BASE_URL}/${selectedInventoryItem.icon}`} />
					<ItemDetail
						name={selectedInventoryItem.name}
						type={ITEM_TYPE_MAPPING[selectedInventoryItem.type]}
						description={selectedInventoryItem.description}
						quantity={selectedInventoryItem.quantity}
					/>
				</>}
			</div>

			<div className={styles.secondary}>
				<select
					value={itemType}
					onChange={(e) => handleSelectOnClick(e, setItemType)}
				>
					{Object.entries(ITEM_TYPE_MAPPING).map(([type, label]) => (
						<option key={type} value={type}>{label}</option>
					))}
				</select>

				{inventoryItems.map((item, i) => (
					<InventoryItem
						key={i}
						icon={`${API_BASE_URL}/${item.icon}`}
						quantity={item.quantity}
						onClick={() => setSelectedInventoryItem(item)}
					/>
				))}
			</div>
		</div>
	);
}

export default InventoryPage;