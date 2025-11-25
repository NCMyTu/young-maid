import React, { useEffect, useState } from "react";
import styles from "./ShopPage.module.css";
import clsx from "clsx";
import TopBar from "@/component/TopBar/TopBar";
import ResourceBadges from "@/component/TopBar/Group/ResourceBadges";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";
import SettingButton from "@/component/NavButton/SettingButton";
import ShopCategory from "@/component/ShopCatgory/ShopCategory";
import itemIcon from "/asset/icon/item.svg";
import ShopItem from "@/component/ShopItem/ShopItem";
import goldIcon from "/asset/icon/gold.svg";
import gemIcon from "/asset/icon/gem.svg";

// TODO: implement drag-and-scroll

const generateShopCategories = (n: number): React.JSX.Element[] => Array.from({ length: n }, (_, i) => (
	<ShopCategory key={i} name={`shop-category-${i}`} iconSrc={itemIcon} />
));

const generateShopItems = (shopItems: any[]): React.JSX.Element[] => {
	return shopItems.map((item, i) => (
		<ShopItem
			key={i}
			name={item.name}
			price={item.price}
			iconSrc={item.icon}
			currencySrc={item.currency === "gold" ? goldIcon : gemIcon}
		/>
	));
}

const shopCategories = generateShopCategories(10);

function ShopPage(): React.JSX.Element {
	const [shopItems, setShopItems] = useState([]);

	useEffect(() => {
		async function fetchShopItems() {
			const res = await fetch("http://localhost:19722/api/items/shop", {
				method: "GET",
				credentials: "include"
			});

			if (!res.ok)
				return [];

			const data = await res.json();
			console.log(data.items);
			return data.items;
		}

		(async () => {
			const items = await fetchShopItems();
			setShopItems(items);
		})();
	}, []);

	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="shop" />
				<ResourceBadges />
				<SettingButton />
			</TopBar>

			<div className={clsx("left-bar", styles.leftBar)}>
				{shopCategories}
			</div>

			<div className={clsx("item-section", styles.itemSection)}>
				{generateShopItems(shopItems)}
			</div>
		</div>
	);
}

export default ShopPage;