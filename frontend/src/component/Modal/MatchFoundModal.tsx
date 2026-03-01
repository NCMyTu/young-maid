import React from "react";
import ReactDOM from "react-dom";
import styles from "./MatchFoundModal.module.css";
import type { ModalProps } from "./Modal.type";

function MatchFoundModal({
	isOpen
}: Pick<ModalProps, "isOpen">): React.JSX.Element | null {
	if (!isOpen)
		return null;

	const portal = document.getElementById("portal");
	if (!portal)
		return null;

	return ReactDOM.createPortal(
		<div className={styles.overlay}>
			<span>Match Found</span>
		</div>,
		portal
	);
}

export default MatchFoundModal;