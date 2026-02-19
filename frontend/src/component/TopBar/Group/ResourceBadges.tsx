import React from "react";
import styles from "./ResourceBadges.module.css";
import clsx from "clsx";
import GemBadge from "@/component/ResourceBadge/GemBadge";
import GoldBadge from "@/component/ResourceBadge/GoldBadge";

function ResourceBadges({ gold, gem }: { gold: number, gem: number }): React.JSX.Element {
	return (
		<div className={clsx("resource-badge-group", styles.container)}>
			<GoldBadge amount={gold} />
			<GemBadge amount={gem} />
		</div>
	);
}

export default ResourceBadges;