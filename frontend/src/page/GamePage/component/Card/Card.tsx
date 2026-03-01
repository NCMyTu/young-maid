import React from "react";
import styles from "./Card.module.css";
import clsx from "clsx";
import type { CardProps } from "./Card.type";

function Card({
	suit,
	value,
	isFaceDown = false,
	isHoverable = false,
	className
}: CardProps): React.JSX.Element {
	return <div className={clsx(styles.container, isHoverable && styles.hover, className)}>
		{isFaceDown
			? <div className={styles.back} />
			: <>
				<span>{suit}</span>
				<span>{value}</span>
			</>
		}
	</div>;
}

export default Card;