import React from "react";
import styles from "./TopBar.module.css";
import type { ITopBarProps } from "./TopBar.type";

function TopBar({ children }: ITopBarProps): React.JSX.Element {
	return (
		<div className={`top-bar ${styles.div}`}>
			{children}
		</div>
	)
}

export default TopBar;