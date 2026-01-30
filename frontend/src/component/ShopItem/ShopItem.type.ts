interface IShopItemProps {
	name: string;
	price: number;
	currencySrc: string;
	iconSrc: string;
	onClick: () => void;
	// For styling purpose
	className?: string
}

export type { IShopItemProps };