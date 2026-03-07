import React from "react";
import styles from "./Card.module.css";
import clsx from "clsx";
import type { CardProps } from "./Card.type";

import club from "/asset/icon/card-suit/club.svg";
import diamond from "/asset/icon/card-suit/diamond.svg";
import heart from "/asset/icon/card-suit/heart.svg";
import spade from "/asset/icon/card-suit/spade.svg";

const SUIT_MAPPING = {
	club: club,
	diamond: diamond,
	heart: heart,
	spade: spade
};
const VALUE_MAPPING = ["A", 1, 2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K"];

function Card({
	suit,
	value,
	isFaceDown = false,
	isHoverable = false,
	onClick,
	className
}: CardProps): React.JSX.Element {
	return (
		<div
			onClick={onClick}
			className={clsx(
				styles.container,
				isHoverable && styles.hoverable,
				className
			)}
		>
			{isFaceDown
				? <div className={styles.back} />
				: <>
					<span>{VALUE_MAPPING[value! - 1]}</span>
					<img src={SUIT_MAPPING[suit!]} />
					<span>{VALUE_MAPPING[value! - 1]}</span>
				</>
			}
		</div>
	);
}

export default Card;