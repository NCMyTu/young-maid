import React from "react";
import styles from "./ShopItem.module.css";
import clsx from "clsx";
import type { IShopItemProps } from "./ShopItem.type";

function ShopItem({
	name,
	price,
	currencySrc,
	iconSrc,
	onClick,
	className
}: IShopItemProps): React.JSX.Element {
	return (
		<div className={clsx("shop-item", styles.container, className)} onClick={onClick}>
			<img className={clsx(styles.icon)} src={iconSrc} />
			<p className={clsx(styles.name)}>
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