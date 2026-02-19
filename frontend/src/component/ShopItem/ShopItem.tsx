import React from "react";
import styles from "./ShopItem.module.css";
import clsx from "clsx";
import type { ShopItemProps } from "./ShopItem.type";

function ShopItem({
	name,
	price,
	currencySrc,
	iconSrc,
	isOwnershipLocked,
	quantity,
	onClick,
	className
}: ShopItemProps): React.JSX.Element {
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
			<div className={styles.iconContainer}>
				<img src={iconSrc} />
				{quantity && <span>{quantity}</span>}
			</div>

			{/* TODO: make this slide when name is too long. */}
			<p className={clsx(styles.name)}>{name}</p>

			<div className={clsx(styles.priceContainer)}>
				<img className={clsx(styles.currencyIcon)} src={currencySrc} />
				<p className={clsx(styles.price)}>{price}</p>
			</div>
		</div>
	);
}

export default ShopItem;