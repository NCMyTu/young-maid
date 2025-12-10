import React from "react";
import clsx from "clsx";
import styles from "./AdminPage.module.css";
import TopBar from "@/component/TopBar/TopBar";
import BackButtonAndScreenName from "@/component/TopBar/Group/BackButtonAndScreenName";

function AdminPage(): React.JSX.Element {
	return (
		<div className={clsx(styles.container)}>
			<TopBar className={clsx(styles.topBar)}>
				<BackButtonAndScreenName screenName="admin" />
			</TopBar>
		</div>
	);
}

export default AdminPage;