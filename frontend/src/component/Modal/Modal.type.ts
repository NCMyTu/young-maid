import React from "react";

interface IModalProps {
	isOpen: boolean;
	title?: string;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	children: React.ReactNode;
	// For styling purpose
	className?: string
}

export type { IModalProps };