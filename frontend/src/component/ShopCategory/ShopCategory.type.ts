type ShopCategoryProps = {
	name: string;
	iconSrc: string;
	isActive: boolean;
	onClick: () => void;
	// For styling purpose
	className?: string
};

export type { ShopCategoryProps };