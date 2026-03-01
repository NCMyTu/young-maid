import React from "react";
import styles from "./PlayerInfo.module.css";
import clsx from "clsx";
import type { PlayerInfoProps } from "./PlayerInfo.type";

function PlayerInfo({
	avatar,
	displayName,
	tagLine,
	className
}: PlayerInfoProps): React.JSX.Element {
	return (
		<div className={clsx(styles.container, className)}>
			<img src={avatar} />
			<span>{displayName}</span>
			<span>#{tagLine}</span>
		</div>
	);
}

export default PlayerInfo;