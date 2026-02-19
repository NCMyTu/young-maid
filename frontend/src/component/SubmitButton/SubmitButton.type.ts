type SubmitButtonProps = {
	// Text of the button
	text: string;
	id?: string;
	// For styling purpose
	className?: string;
	onClick?: (...args: any[]) => void | Promise<void>
};

export type { SubmitButtonProps };