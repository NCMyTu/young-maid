import type { IResourceBadgeProps } from "./ResourceBadge.type";
import styles from "./ResourceBadge.module.css";
import defaultAddIcon from "/asset/icon/plus.svg";

const handleOnClick = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	// TODO: Implement payment modal popup
	// TODO: This triggers with a drag-and-drop. Make it trigger only when user truly clicks.
	alert("TODO: Implement payment modal popup");
	console.warn("TODO: Implement payment modal popup");
};

function ResourceBadge({
	amount, maxAmount, iconSrc, resourceName, addIconSrc
}: IResourceBadgeProps): React.JSX.Element {
	const addIcon = addIconSrc || defaultAddIcon;
	const resourceText = maxAmount ? `${amount}/${maxAmount}` : amount;

	return (
		<div
			className={`resource-badge-${resourceName} ${styles.div}`}
			onClick={handleOnClick}
		>
			<img className={`${styles.icon}`} src={iconSrc} />
			<p className={`resource-badge-amount ${styles.amount}`}>{resourceText}</p>
			<img className={`${styles.add}`} src={addIcon} />
		</div>
	);
}

export default ResourceBadge;