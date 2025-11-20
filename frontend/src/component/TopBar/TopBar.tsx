import React from "react";
import styles from "./TopBar.module.css";
import clsx from "clsx";
import type { ITopBarProps } from "./TopBar.type";

function TopBar({ children, className }: ITopBarProps): React.JSX.Element {
	return (
		<div className={clsx("top-bar", styles.div, className)}>
			{children}
		</div>
	);
}

export default TopBar;