import React from "react";
import styles from "./InventoryItem.module.css";
import type { IInventoryItemProps } from "./InventoryItem.type";

function InventoryItem({
	icon,
	quantity,
	onClick
}: IInventoryItemProps): React.JSX.Element | null {
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