import React from "react";
import styles from "./ResourceBadge.module.css";
import clsx from "clsx";
import type { ResourceBadgeProps } from "./ResourceBadge.type";
import defaultAddIcon from "/asset/icon/plus.svg";

const handleOnClick = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	// TODO: Implement payment modal popup
	// TODO: This triggers with a drag-and-drop. Make it trigger only when user truly clicks.
	alert("TODO: Implement payment modal popup");
	console.warn("TODO: Implement payment modal popup");
};

function ResourceBadge({
	amount, maxAmount, iconSrc, resourceName, addIconSrc
}: ResourceBadgeProps): React.JSX.Element {
	const addIcon = addIconSrc || defaultAddIcon;
	const resourceText = maxAmount ? `${amount}/${maxAmount}` : amount;

	return (
		<div
			className={clsx(`resource-badge-${resourceName}`, styles.container)}
			onClick={handleOnClick}
		>
			<img className={clsx(styles.icon)} src={iconSrc} />
			<p className={clsx("resource-badge-amount", styles.amount)}>{resourceText}</p>
			<img className={clsx(styles.add)} src={addIcon} />
		</div>
	);
}

export default ResourceBadge;