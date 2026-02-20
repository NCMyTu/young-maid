import React, { useEffect } from "react";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import HomePage from "@/page/HomePage/HomePage";
import InventoryPage from "@/page/InventoryPage/InventoryPage";
import ShopPage from "@/page/ShopPage/ShopPage";
import AdminPage from "@/page/AdminPage/AdminPage";
import useUser from "@/lib/store/user/user";
import { ENDPOINTS } from "@/config/endpoints";

function RootPage(): React.JSX.Element {
	const setUser = useUser((state) => state.setUser);
	const clearUser = useUser((state) => state.clear);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(ENDPOINTS.AUTH.verify, {
					credentials: "include",
				});

				if (!res.ok)
					throw new Error("Session expired");

				const data = await res.json();

				if (data?.user)
					setUser(data.user);
				else
					throw new Error("Backend didn't include user info or somehow json failed");
			} catch (e) {
				clearUser();
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
			case "inventory":
				return <InventoryPage />;
			case "admin":
				return <AdminPage />;
			default:
				return <div>Whatcha doin here? GTFO!!!</div>;
		}
	})();

	return <>{screenToRender}</>;
};

export default RootPage;