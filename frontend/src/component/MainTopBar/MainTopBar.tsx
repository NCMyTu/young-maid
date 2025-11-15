import React from "react";
import styles from "./MainTopBar.module.css";
import ResourceBadgeGroup from "@/component/ResourceBadge/ResourceBadgeGroup";
import MailModalButton from "@/ModalButton/MailModalButton";
import FriendModalButton from "@/ModalButton/FriendModalButton";
import SettingModalButton from "@/ModalButton/SettingModalButton";
import defaultAvatar from "/asset/icon/avatar.svg";

/* Used in main page
*/
function MainTopBar(): React.JSX.Element {
	return (
		<div className={`main-top-bar ${styles.div}`}>
			<div className={`player-info ${styles.playerInfo}`}>
				<img className={`${styles.avatar}`} src={defaultAvatar}></img>
				<p className={`display-name ${styles.displayName}`}>Display name</p>
				<p className={`tagline ${styles.tagline}`}>#TAGLINE</p>
			</div>
			<ResourceBadgeGroup />

			<div className={`${styles.buttonGroup}`}>
				<MailModalButton />
				<FriendModalButton />
				<SettingModalButton />
			</div>
		</div>
	);
}

export default MainTopBar;