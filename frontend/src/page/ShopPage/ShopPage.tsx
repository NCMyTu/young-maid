import React from "react";
import styles from "./ShopPage.module.css";
import clsx from "clsx";
import TopBar from "@/component/TopBar/TopBar";
import ResourceBadges from "@/component/TopBar/Group/ResourceBadges";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";
import SettingButton from "@/component/NavButton/SettingButton";

function ShopPage(): React.JSX.Element {
	return (
		<div className={clsx(styles.div)}>
			<TopBar className={styles.topBar}>
				<BackButtonAndScreenName screenName="shop" />
				<ResourceBadges />
				<SettingButton />
			</TopBar>

			<div className={clsx("left-bar", styles.leftBar)}>LEFT BAR</div>

			<div className={clsx("item-section", styles.itemSection)}>ITEM SECTION</div>
		</div>
	);
}

export default ShopPage;