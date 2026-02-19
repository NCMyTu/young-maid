import React from "react";
import styles from "./InventoryItem.module.css";
import type { InventoryItemProps } from "./InventoryItem.type";

function InventoryItem({
	icon,
	quantity,
	onClick
}: InventoryItemProps): React.JSX.Element | null {
	if (quantity !== undefined && quantity <= 0)
		return null;

	return (
		<div className={styles.container} onClick={onClick}>
			<img src={icon} />
			{quantity &&
				<span className={styles.quantity}>{quantity}</span>
			}
		</div>
	);
}

export default InventoryItem;