type CardProps = {
	suit?: "heart" | "spade" | "club" | "diamond";
	value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
	isFaceDown?: boolean;
	isHoverable?: boolean;
	className?: string
};

export type { CardProps };