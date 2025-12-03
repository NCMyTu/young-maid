import React from "react";

interface IModalProps {
	children: React.ReactNode,
	isShowing: boolean,
	onClose: () => void,
	onConfirm?: any,
	title?: string,
	// Additional class for the outmost div to style it
	className?: string
}

export type { IModalProps };