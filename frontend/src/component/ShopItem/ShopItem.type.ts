interface IShopItemProps {
	name: string,
	price: number,
	currencySrc: string,
	iconSrc: string,
	// Additional class for the outmost div to style it
	className?: string
}

export type { IShopItemProps };