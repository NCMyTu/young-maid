import React from "react";
import styles from "./ShopItem.module.css";
import clsx from "clsx";
import type { IShopItemProps } from "./ShopItem.type";

function ShopItem({
	name,
	price,
	currencySrc,
	iconSrc,
	isOwnershipLocked,
	onClick,
	className
}: IShopItemProps): React.JSX.Element {
	return (
		<div
			className={clsx(
				"shop-item",
				styles.container,
				isOwnershipLocked && styles.disabled,
				className
			)}
			onClick={!isOwnershipLocked ? onClick : undefined}
		>
			<img className={clsx(styles.icon)} src={iconSrc} />
			<p className={clsx(styles.name)}>
				{/* TODO: make this slide when name is too long. */}
				<span>{name}</span>
			</p>
			<div className={clsx(styles.priceContainer)}>
				<img className={clsx(styles.currencyIcon)} src={currencySrc} />
				<p className={clsx(styles.price)}>{price}</p>
			</div>
		</div>
	);
}

export default ShopItem;