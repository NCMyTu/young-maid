import React from "react";
import { useShallow } from "zustand/shallow";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import useUser from "@/lib/store/user/user";

function HomePage(): React.JSX.Element {
	const pushScreen = useScreenStack((state) => state.push);
	const user = useUser(useShallow((state) => ({
		id: state.id,
		displayName: state.displayName,
		tagline: state.tagline,
		role: state.role
	})));

	return (
		<>
			<p>This is HOME</p>
			<p>user id: {user.id}</p>
			<p>user displayName: {user.displayName}</p>
			<p>user tagline: {user.tagline}</p>
			<p>user role: {user.role}</p>
			<button
				onClick={() => pushScreen("shop")}
			>
				Go to SHOP
			</button>
		</>
	);
}

export default HomePage;