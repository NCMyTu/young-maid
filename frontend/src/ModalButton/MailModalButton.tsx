import React from "react";
import ModalButton from "./ModalButton";
import icon from "/asset/icon/mail.svg";

function MailModalButton(): React.JSX.Element {
	return <ModalButton buttonName="mail" iconSrc={icon} />
}

export default MailModalButton;