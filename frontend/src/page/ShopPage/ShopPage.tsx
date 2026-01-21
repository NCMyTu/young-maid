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
import Modal from "@/component/Modal/Modal";
import { API_BASE_URL, ENDPOINTS } from "@/config/endpoints";

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
			iconSrc={`${API_BASE_URL}/${item.icon}`}
			currencySrc={item.currency === "gold" ? goldIcon : gemIcon}
		/>
	));
}

const shopCategories = generateShopCategories(10);

function ShopPage(): React.JSX.Element {
	const [shopItems, setShopItems] = useState([]);

	useEffect(() => {
		async function fetchShopItems() {
			const res = await fetch(ENDPOINTS.GET.shopItems, {
				method: "GET",
				credentials: "include"
			});

			if (!res.ok)
				return [];

			const data = await res.json();
			return data.items;
		}

		(async () => {
			const items = await fetchShopItems();
			setShopItems(items);
		})();
	}, []);

	const [isModalShowing, setModalShowing] = useState(false);

	const toggleModal = () => {
		setModalShowing(!isModalShowing);
	}

	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="shop" />
				<ResourceBadges />
				<SettingButton />
				<div>
					<button onClick={toggleModal}>
						This is the modal's button
					</button>
				</div>
			</TopBar>

			<Modal
				isShowing={isModalShowing}
				onClose={toggleModal}
				onConfirm={toggleModal}
				title={"MODAL"}
			>
				<p>This is the modal's content</p>
			</Modal>

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