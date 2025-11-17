import React from "react";
import NavButton from "./NavButton";
import icon from "/asset/icon/setting.svg";

function SettingButton(): React.JSX.Element {
	return <NavButton buttonName="setting" iconSrc={icon} />
}

export default SettingButton;