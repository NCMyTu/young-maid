import React from "react";
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

const generateShopItems = (n: number): React.JSX.Element[] => Array.from({ length: n }, (_, i) => (
	<ShopItem key={i} name={`This is gold no ${i} which is bought by gem`} price={5000} iconSrc={goldIcon} currencySrc={gemIcon} />
));

function ShopPage(): React.JSX.Element {
	const shopCategories: React.JSX.Element[] = generateShopCategories(20);
	const shopItems: React.JSX.Element[] = generateShopItems(20);

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
				{shopItems}
			</div>
		</div>
	);
}

export default ShopPage;