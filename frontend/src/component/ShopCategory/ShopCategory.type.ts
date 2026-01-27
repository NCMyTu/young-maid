interface IShopCategoryProps {
	name: string;
	iconSrc: string;
	isActive: boolean;
	onClick: () => void;
	// For styling purpose
	className?: string
}

export type { IShopCategoryProps };