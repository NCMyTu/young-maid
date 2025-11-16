import React from "react";
import ResourceBadge from "./ResourceBadge";
import type { IResourceBadgeProps } from "./ResourceBadge.type";
import goldIcon from "/asset/icon/gold.svg";

function GoldBadge({
	amount, maxAmount, addIconSrc
}: Pick<IResourceBadgeProps, "amount" | "addIconSrc" | "maxAmount">): React.JSX.Element {
	return (
		<ResourceBadge
			amount={amount}
			maxAmount={maxAmount}
			iconSrc={goldIcon}
			resourceName="gold"
			addIconSrc={addIconSrc}
		/>
	);
}

export default GoldBadge;