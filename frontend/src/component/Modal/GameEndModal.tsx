import React from "react";
import ReactDOM from "react-dom";
import styles from "./GameEndModal.module.css";
import type { ModalProps } from "./Modal.type";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";

function GameEndModal({
	isOpen,
	isWinner
}: Pick<ModalProps, "isOpen"> & { isWinner: boolean }): React.JSX.Element | null {
	const clearScreen = useScreenStack((state) => state.clear);

	if (!isOpen)
		return null;

	const portal = document.getElementById("portal");
	if (!portal)
		return null;

	return ReactDOM.createPortal(
		<div className={styles.overlay}>
			<span>{isWinner ? "You win!" : "You lose!"}</span>
			<button onClick={clearScreen}>Confirm</button>
		</div>,
		portal
	);
}

export default GameEndModal;