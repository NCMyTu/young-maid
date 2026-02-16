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
import { ITEM_TYPE_LABELS } from "@/type/item.type";
import type { ItemType, InventoryItemResponse } from "@/type/item.type";

// TODO: Cache the fetch result.

const handleSelectOnClick = (
	e: React.ChangeEvent<HTMLSelectElement>,
	setItemType: React.Dispatch<React.SetStateAction<ItemType>>
): void => {
	const value = e.target.value;
	if (value in ITEM_TYPE_LABELS)
		setItemType(value as ItemType);
}

function InventoryPage(): React.JSX.Element {
	const [itemType, setItemType] = useState<ItemType>(Object.keys(ITEM_TYPE_LABELS)[0]! as ItemType);
	const [inventoryItems, setInventoryItems] = useState<InventoryItemResponse[]>([]);
	const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItemResponse | null>(null);
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

			if (!res.ok)
				console.log("Error fetching items...");

			const inventoryItems: InventoryItemResponse[] = (
				await res.json()
			).inventoryItems as InventoryItemResponse[];

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
						type={ITEM_TYPE_LABELS[selectedInventoryItem.type]}
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
					{Object.entries(ITEM_TYPE_LABELS).map(([itemType, label]) => (
						<option key={itemType} value={itemType}>{label}</option>
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