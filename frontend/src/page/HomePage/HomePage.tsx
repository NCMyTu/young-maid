import React from "react";
import { useNavigate } from "react-router";
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
	const clearUser = useUser((state) => state.clear);
	const navigate = useNavigate();

	const signout = async () => {
		try {
			let res = await fetch("http://localhost:19722/api/users/auth/signout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include"
			});

			if (!res.ok)
				return;

			clearUser();
			navigate("/");
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<p style={{ margin: "10px auto", width: "fit-content", fontSize: "2rem" }}>HOME</p>
			<p>id: {user.id}</p>
			<p>displayName: {user.displayName}</p>
			<p>tagline: {user.tagline}</p>
			<p>role: {user.role}</p>
			<button onClick={signout}>
				Sign out
			</button>
			<button onClick={() => pushScreen("shop")}>
				Go to SHOP
			</button>
			{user.role === "admin" &&
				<button onClick={() => pushScreen("admin")}>
					Admin panel
				</button>
			}
		</>
	);
}

export default HomePage;