import React from "react";
import CurrencyBadge from "./CurrencyBadge.tsx";
import type { ICurrencyBadgeProps } from "./CurrencyBadge.type.ts";
import diamondIcon from "/asset/icon/diamond.svg";

function DiamondBadge({
	amount,
	addIconSrc
}: Pick<ICurrencyBadgeProps, "amount" | "addIconSrc">): React.JSX.Element {
	return (
		<CurrencyBadge
			amount={amount}
			iconSrc={diamondIcon}
			addIconSrc={addIconSrc}
		/>
	);
}

export default DiamondBadge;