import React, { useState } from "react";
import clsx from "clsx";
import styles from "./AdminPage.module.css";
import TopBar from "@/component/TopBar/TopBar";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";
import CreateShopItemForm from "@/component/CreateShopItemForm/CreateShopItemForm";
import { ENDPOINTS } from "@/config/endpoints";


// TODO: have a dedicated service handling api calls. it's getting out of hand.


async function fetchShopItems() {
	const res = await fetch(ENDPOINTS.ADMIN.GET.shopItems, {
		method: "GET",
		credentials: "include"
	});

	if (!res.ok)
		return [];

	const data = await res.json();
	return data.items;
}

function AdminPage(): React.JSX.Element {
	const [items, setItems] = useState<any[]>([]);

	const handleFetchItems = async () => {
		const result = await fetchShopItems();
		console.log(result);
		setItems(result);
	}
	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="admin" />
			</TopBar>

			<div className={clsx("left-bar", styles.leftBar)}>
				<div>Shop item</div>
				<button onClick={handleFetchItems}>Fetch Shop Items</button>
				<div>User</div>
			</div>

			<div className={clsx("content-section", styles.contentSection)}>
				<CreateShopItemForm />

				{items.length === 0
					? "No items"
					: items.map((item: any) => <div key={item.id}>{JSON.stringify(item)}</div>)
				}
			</div>
		</div>
	);
}

export default AdminPage;