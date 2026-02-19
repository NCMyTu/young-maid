import React from "react";
import styles from "./UserAvatarName.module.css";
import type { UserAvatarNameProps } from "./UserAvatarName.type";

function UserAvatarName({
	avatar,
	displayName,
	tagLine
}: UserAvatarNameProps): React.JSX.Element {
	return <div className={styles.container}>
		<img
			className={styles.avatar}
			src={avatar}
			draggable={false}
		/>
		<span className={styles.displayName}>{displayName}</span>
		<span className={styles.tagLine}>#{tagLine}</span>
	</div>;
}

export default UserAvatarName;