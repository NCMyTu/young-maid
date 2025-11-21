import React from "react";
import styles from "./BackButtonAndScreenName.module.css";
import clsx from "clsx";
import icon from "/asset/icon/back.svg";

const handleButtonOnClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	alert("TODO: implement the back button");
}

function BackButtonAndScreenName({
	screenName
}: { screenName?: string }): React.JSX.Element {
	return (
		<div className={styles.div}>
			<button className={clsx("back-button", styles.button)} onClick={handleButtonOnClick}>
				<img className={clsx(styles.icon)} src={icon} />
			</button>
			{screenName && <p className={clsx("screen-name", styles.p)}>{screenName}</p>}
		</div>
	);
}

export default BackButtonAndScreenName;