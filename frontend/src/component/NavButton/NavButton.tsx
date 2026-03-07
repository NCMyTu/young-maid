import React from "react";
import clsx from "clsx";
import styles from "./NavButton.module.css";
import type { NavButtonProps } from "./NavButton.type";

const handleOnClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	alert("TODO: implement modal popup when clicking this button");
};

function NavButton({
	buttonName, iconSrc
}: NavButtonProps): React.JSX.Element {
	return (
		<button
			className={clsx(`nav-button-${buttonName}`, styles.button)}
			onClick={handleOnClick}
		>
			<img className={clsx(styles.icon)} src={iconSrc} />
		</button>
	);
}

export default NavButton;