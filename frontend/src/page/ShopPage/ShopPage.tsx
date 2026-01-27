import React, { useEffect, useState } from "react";
import styles from "./ShopPage.module.css";
import clsx from "clsx";
import TopBar from "@/component/TopBar/TopBar";
import ResourceBadges from "@/component/TopBar/Group/ResourceBadges";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";
import SettingButton from "@/component/NavButton/SettingButton";
import ShopCategory from "@/component/ShopCategory/ShopCategory";
import itemIcon from "/asset/icon/item.svg";
import ShopItem from "@/component/ShopItem/ShopItem";
import goldIcon from "/asset/icon/gold.svg";
import gemIcon from "/asset/icon/gem.svg";
import { API_BASE_URL, ENDPOINTS } from "@/config/endpoints";
import useUser from "@/lib/store/user/user";
import { useShallow } from "zustand/shallow";
import type { ShopPageItemCategories } from "./ShopPage.type";

// TODO:
// Type properly.
// Implement drag-and-scroll.

const SHOP_ITEM_CATEGORIES: ShopPageItemCategories[] = [
	{ itemType: "card-back", name: "Card Back" },
	{ itemType: "card-face", name: "Card Face" },
	{ itemType: "table-cloth", name: "Table Cloth" }
];

const fetchShopItems = async (type: string) => {
	const url = `${ENDPOINTS.GET.shopItems}/?type=${type}`;

	const res = await fetch(url, {
		method: "GET",
		credentials: "include"
	});

	if (!res.ok)
		return [];

	const data = await res.json();
	return data.items;
};

function ShopPage(): React.JSX.Element {
	const [selectedCategory, setSelectedCategory] = useState<ShopPageItemCategories>(
		// Carefully careful
		SHOP_ITEM_CATEGORIES[0]!
	);
	//                                         ↓ uh oh...
	const [shopItems, setShopItems] = useState<any>([]);
	const user = useUser(useShallow((state) => ({
		id: state.id,
		gold: state.gold,
		gem: state.gem
	})));

	useEffect(() => {
		(async () => {
			const items = await fetchShopItems(selectedCategory.itemType);
			setShopItems(items);
		})();
	}, [selectedCategory]);

	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="shop" />
				<ResourceBadges gold={user.gold} gem={user.gem} />
				<SettingButton />
			</TopBar>

			<div className={clsx("left-bar", styles.leftBar)}>
				{SHOP_ITEM_CATEGORIES.map((category: ShopPageItemCategories) => (
					<ShopCategory
						key={category.itemType}
						name={`${category.name}`}
						iconSrc={itemIcon}
						isActive={category.itemType === selectedCategory.itemType}
						onClick={() => setSelectedCategory(category)}
					/>
				))}
			</div>

			<div className={clsx("item-section", styles.itemSection)}>
				{shopItems.map((item: any) => (
					<ShopItem
						key={item.id}
						name={item.name}
						price={item.price}
						iconSrc={`${API_BASE_URL}/${item.icon}`}
						currencySrc={item.currency === "gold" ? goldIcon : gemIcon}
					/>
				))}
			</div>
		</div>
	);
}

export default ShopPage;