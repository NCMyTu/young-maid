import React from "react";
import styles from "./BackButtonAndScreenName.module.css";
import clsx from "clsx";
import icon from "/asset/icon/back.svg";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";

function BackButtonAndScreenName({
	screenName
}: { screenName?: string }): React.JSX.Element {
	const popScreen = useScreenStack((state) => state.pop);

	return (
		<div className={styles.div}>
			<button
				className={clsx("back-button", styles.button)}
				onClick={popScreen}
			>
				<img className={clsx(styles.icon)} src={icon} />
			</button>
			{screenName && <p className={clsx("screen-name", styles.p)}>{screenName}</p>}
		</div>
	);
}

export default BackButtonAndScreenName;