import React from "react";
import styles from "./SecondaryTopBar.module.css";
import ResourceBadgeGroup from "@/component/ResourceBadge/ResourceBadgeGroup";
import backIcon from "/asset/icon/back.svg";

const handleButtonOnClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	alert("TODO: implement the back button")
}

/* Used in shop and inventory
*/
function SecondaryTopBar(): React.JSX.Element {
	return (
		<div className={`secondary-top-bar ${styles.div}`}>
			<button className={`secondary-top-bar-back ${styles.button}`} onClick={handleButtonOnClick}>
				<img className={`${styles.icon}`} src={backIcon}></img>
			</button>

			<ResourceBadgeGroup />
		</div>
	)
}

export default SecondaryTopBar;