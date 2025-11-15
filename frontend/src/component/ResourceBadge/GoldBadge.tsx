import React from "react";
import ResourceBadge from "./ResourceBadge";
import type { IResourceBadgeProps } from "./ResourceBadge.type";
import goldIcon from "/asset/icon/gold.svg";

function GoldBadge({
	amount,
	addIconSrc
}: Pick<IResourceBadgeProps, "amount" | "addIconSrc">): React.JSX.Element {
	return (
		<ResourceBadge
			amount={amount}
			iconSrc={goldIcon}
			resourceName="gold"
			addIconSrc={addIconSrc}
		/>
	);
}

export default GoldBadge;