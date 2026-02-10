interface IShopItemProps {
	name: string;
	price: number;
	currencySrc: string;
	iconSrc: string;
	quantity?: number;
	isOwnershipLocked: boolean;
	onClick: () => void;
	// For styling purpose
	className?: string
}

export type { IShopItemProps };