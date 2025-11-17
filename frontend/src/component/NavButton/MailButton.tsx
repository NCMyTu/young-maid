import React from "react";
import NavButton from "./NavButton";
import icon from "/asset/icon/mail.svg";

function MailButton(): React.JSX.Element {
	return <NavButton buttonName="mail" iconSrc={icon} />
}

export default MailButton;