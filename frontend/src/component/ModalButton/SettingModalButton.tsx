import React from "react";
import ModalButton from "./ModalButton";
import icon from "/asset/icon/setting.svg";

function SettingModalButton(): React.JSX.Element {
	return <ModalButton buttonName="setting" iconSrc={icon} />
}

export default SettingModalButton;