import React from "react";
import styles from "./ShopCategory.module.css";
import clsx from "clsx";
import type { IShopCategoryProps } from "./ShopCategory.type";

function ShopCategory({
	name,
	iconSrc,
	isActive,
	onClick,
	className
}: IShopCategoryProps): React.JSX.Element {
	const containerClassName = clsx(
		"shop-category",
		styles.container,
		isActive && styles.containerActive,
		className
	);

	return (
		<div className={containerClassName} onClick={onClick}>
			<img className={clsx(styles.icon)} src={iconSrc} />
			<p className={clsx(styles.text)}>{name}</p>
		</div>
	);
}

export default ShopCategory;