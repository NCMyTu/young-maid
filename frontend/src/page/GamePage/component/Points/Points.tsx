import React from "react";
import styles from "./Points.module.css";
import clsx from "clsx";
import type { PointsProps } from "./Points.type";

function Points({ points, className }: PointsProps): React.JSX.Element {
	return (
		<div className={clsx(styles.container, className)}>
			<span>Points:</span>
			<span>{points}</span>
		</div>
	);
}

export default Points;