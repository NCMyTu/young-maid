import React from "react";

interface IModalProps {
	children: React.ReactNode,
	isShowing: boolean;
	onClose: () => void;
	onConfirm?: any;
	title?: string;
	// For styling purpose
	className?: string
}

export type { IModalProps };