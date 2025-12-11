import React, { useEffect } from "react";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import HomePage from "@/page/HomePage/HomePage";
import ShopPage from "@/page/ShopPage/ShopPage";
import AdminPage from "@/page/AdminPage/AdminPage";
import useUser from "@/lib/store/user/user";

function RootPage(): React.JSX.Element {
	const setUser = useUser((state) => state.setUser);
	const clear = useUser((state) => state.clear);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("http://localhost:19722/api/users/auth/verify", {
					credentials: "include",
				});

				if (!res.ok)
					throw new Error("Session expired");

				const data = await res.json();

				if (data?.user)
					setUser(data.user);
				else
					throw new Error("Backend didn't include user info or somehow json failed")
			} catch (e) {
				clear();
			}
		})();
	}, []);

	const currentScreen = useScreenStack((state) => state.current());

	const screenToRender = (() => {
		switch (currentScreen) {
			case "home":
				return <HomePage />;
			case "shop":
				return <ShopPage />;
			case "admin":
				return <AdminPage />;
			default:
				return <div>Whatcha doin here? GTFO!!!</div>;
		}
	})();

	return <>{screenToRender}</>;
};

export default RootPage;