import React from "react";
import ModalButton from "./ModalButton";
import icon from "/asset/icon/friend.svg";

function FriendModalButton(): React.JSX.Element {
	return <ModalButton buttonName="friend" iconSrc={icon} />
}

export default FriendModalButton;