import React from "react";
import styles from "./ResourceBadges.module.css";
import clsx from "clsx";
import GemBadge from "@/component/ResourceBadge/GemBadge";
import GoldBadge from "@/component/ResourceBadge/GoldBadge";

function ResourceBadges(): React.JSX.Element {
	return (
		<div className={clsx("resource-badge-group", styles.div)}>
			<GemBadge amount={2222222222222222222222222222222222222222222222222222222222} />
			<GoldBadge amount={123132} maxAmount={10} />
		</div>
	);
}

export default ResourceBadges;