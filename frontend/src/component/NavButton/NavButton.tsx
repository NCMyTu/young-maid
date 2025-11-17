import React from "react";
import styles from "./NavButton.module.css";
import type { INavButtonProps } from "./NavButton.type";

const handleOnClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	// TODO: implement modal popup
	alert("TODO: implement modal popup when clicking this button");
};

function NavButton({
	buttonName, iconSrc
}: INavButtonProps): React.JSX.Element {
	return (
		<button className={`modal-button-${buttonName} ${styles.button}`} onClick={handleOnClick}>
			<img className={`${styles.icon}`} src={iconSrc}></img>
		</button>
	);
}

export default NavButton;