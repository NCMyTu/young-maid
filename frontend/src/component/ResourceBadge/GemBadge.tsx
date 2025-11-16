import React from "react";
import ResourceBadge from "./ResourceBadge";
import type { IResourceBadgeProps } from "./ResourceBadge.type";
import gemIcon from "/asset/icon/gem.svg";

function GemBadge({
	amount, maxAmount, addIconSrc
	}: Pick<IResourceBadgeProps, "amount" | "addIconSrc" | "maxAmount">): React.JSX.Element {
	return (
		<ResourceBadge
			amount={amount}
			maxAmount={maxAmount}
			iconSrc={gemIcon}
			resourceName="gem"
			addIconSrc={addIconSrc}
		/>
	);
}

export default GemBadge;