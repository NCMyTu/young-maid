import React from "react";
import styles from "./ResourceBadgeGroup.module.css";
import GemBadge from "./GemBadge";
import GoldBadge from "./GoldBadge";

function ResourceBadgeGroup(): React.JSX.Element {
	return (
		<div className={`resource-badge-group ${styles.div}`}>
			<GemBadge amount={22222} />
			<GoldBadge amount={123132} />
		</div>
	)
}

export default ResourceBadgeGroup;