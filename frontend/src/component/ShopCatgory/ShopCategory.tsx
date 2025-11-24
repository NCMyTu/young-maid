import React from "react";
import styles from "./ShopCategory.module.css";
import clsx from "clsx";
import type { IShopCategoryProps } from "./ShopCategory.type";

const handleOnClick = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	alert("TODO: implement ShopCategory onClick");
};

function ShopCategory({
	name,
	iconSrc,
	className
}: IShopCategoryProps): React.JSX.Element {
	return (
		<>
			<div className={clsx("shop-category", styles.div, className)} onClick={handleOnClick}>
				<img className={clsx(styles.icon)} src={iconSrc} />
				<p className={clsx(styles.text)}>{name}</p>
			</div>
		</>
	);
}

export default ShopCategory;