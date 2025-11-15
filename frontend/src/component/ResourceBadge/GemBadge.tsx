import React from "react";
import ResourceBadge from "./ResourceBadge";
import type { IResourceBadgeProps } from "./ResourceBadge.type";
import gemIcon from "/asset/icon/gem.svg";

function GemBadge({
	amount,
	addIconSrc
}: Pick<IResourceBadgeProps, "amount" | "addIconSrc">): React.JSX.Element {
	return (
		<ResourceBadge
			amount={amount}
			iconSrc={gemIcon}
			resourceName="gem"
			addIconSrc={addIconSrc}
		/>
	);
}

export default GemBadge;