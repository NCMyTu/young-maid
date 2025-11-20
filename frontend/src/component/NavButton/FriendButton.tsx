import React from "react";
import NavButton from "./NavButton";
import icon from "/asset/icon/friend.svg";

function FriendButton(): React.JSX.Element {
	return <NavButton buttonName="friend" iconSrc={icon} />;
}

export default FriendButton;