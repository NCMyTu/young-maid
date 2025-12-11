import React from "react";
import clsx from "clsx";
import styles from "./AdminPage.module.css";
import TopBar from "@/component/TopBar/TopBar";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";

async function fetchShopItems() {
	const res = await fetch("http://localhost:19722/api/items/shop", {
		method: "GET",
		credentials: "include"
	});

	if (!res.ok)
		return [];

	const data = await res.json();
	console.log(data);
	return data.items;
}

function AdminPage(): React.JSX.Element {
	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="admin" />
			</TopBar>

			<div className={clsx("left-bar", styles.leftBar)}>
				<div onClick={(_)=>fetchShopItems}>Shop item</div>
				<div>User</div>
			</div>

			<div className={clsx("content-section", styles.contentSection)}>
			</div>
		</div>
	);
}

export default AdminPage;