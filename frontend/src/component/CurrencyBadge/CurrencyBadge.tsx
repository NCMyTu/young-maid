import React from "react";
import styles from "./CurrencyBadge.module.css";
import defaultAddIcon from "/asset/icon/plus.svg";
import type { ICurrencyBadgeProps } from "./CurrencyBadge.type";

const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

};

function CurrencyBadge({
	amount, iconSrc, addIconSrc
}: ICurrencyBadgeProps): React.JSX.Element {
	const addIcon = addIconSrc || defaultAddIcon;

	return (
		<div className={`currency-badge ${styles.currencyBadge}`} onClick={handleOnClick}>
			<img
				className={`currency-icon ${styles.currencyIcon}`}
				src={iconSrc}
			/>
			<p
				className={`currency-amount ${styles.currencyAmount}`}>
				{amount}
			</p>
			<img
				className={`currentcy-add-icon ${styles.currencyAddIcon}`}
				src={addIcon}
			/>
		</div>
	);
}

export default CurrencyBadge;