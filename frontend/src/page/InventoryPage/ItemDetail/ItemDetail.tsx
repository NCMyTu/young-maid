import React from "react";
import styles from "./ItemDetail.module.css";
import clsx from "clsx";

type ItemDetailProps = {
	name: string;
	type: string;
	description: string;
	quantity?: number
};

function ItemDetail({
	name,
	type,
	description,
	quantity
}: ItemDetailProps): React.JSX.Element {
	const hasQuantity = quantity !== undefined && quantity > 0;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.type}>
					<span>{type}</span>
				</p>

				<p className={styles.name}>
					<span>{name}</span>
				</p>

				<p // Hacky way to preserve layout...
					className={clsx(styles.quantity)}
					style={{ visibility: hasQuantity ? "visible" : "hidden" }}
				>
					<span>Owned</span>
					<span>{hasQuantity ? quantity : 111}</span>
				</p>
			</div>

			<div className={styles.description}>{description}</div>
		</div>
	);
}

export default ItemDetail;