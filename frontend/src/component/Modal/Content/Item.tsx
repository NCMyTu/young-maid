import React from "react";
import styles from "./Item.module.css";
import type { IItemProps } from "./Item.type";

function Item({
	icon,
	amountOwned,
	name,
	description
}: IItemProps): React.JSX.Element {
	return <div className={styles.container}>
		<div className={styles.visualSection}>
			<img className={styles.icon} src={icon} />
			<p>Owned: {amountOwned}</p>
		</div>

		<div className={styles.detailSection}>
			<p>{name}</p>
			<p>{description}</p>
		</div>
	</div>;
}

export default Item;