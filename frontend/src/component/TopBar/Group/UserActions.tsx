import React from "react";
import styles from "./UserAction.module.css";
import settingIcon from "/asset/icon/setting.svg"
import signOutIcon from "/asset/icon/sign-out.svg"

type UserActionsProps = {
	settingOnClick: () => void;
	signOutOnClick: () => void
};

function UserActions({ settingOnClick, signOutOnClick }: UserActionsProps): React.JSX.Element {
	return <div className={styles.container}>
		<button id="setting-btn" onClick={settingOnClick}>
			<img src={settingIcon} />
		</button>

		<button id="sign-out-btn" onClick={signOutOnClick}>
			<img src={signOutIcon} />
		</button>
	</div>;
}

export default UserActions;