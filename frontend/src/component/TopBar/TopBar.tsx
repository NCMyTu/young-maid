import React from "react";
import styles from "./TopBar.module.css";
import clsx from "clsx";
import type { TopBarProps } from "./TopBar.type";

function TopBar({ children, className }: TopBarProps): React.JSX.Element {
	return (
		<div className={clsx("top-bar", styles.container, className)}>
			{children}
		</div>
	);
}

export default TopBar;