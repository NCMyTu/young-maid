import React from "react";
import styles from "./ModalButton.module.css";
import type { IModalButtonProps } from "./ModalButton.type";

const handleOnClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	// TODO: implement modal popup
	alert("TODO: implement modal popup when clicking this button");
};

/* Open a modal when clicked */
function ModalButton({
	buttonName, iconSrc
}: IModalButtonProps): React.JSX.Element {
	return (
		<button className={`modal-button-${buttonName} ${styles.button}`} onClick={handleOnClick}>
			<img className={`${styles.icon}`} src={iconSrc}></img>
		</button>
	);
}

export default ModalButton;