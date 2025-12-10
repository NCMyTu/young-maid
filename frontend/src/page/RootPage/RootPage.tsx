import React from "react";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import HomePage from "@/page/HomePage/HomePage";
import ShopPage from "@/page/ShopPage/ShopPage";
import AdminPage from "@/page/AdminPage/AdminPage";

function RootPage(): React.JSX.Element {
	const currentScreen = useScreenStack((state) => state.current());

	// const stack = useScreenStack((state) => state.stack);
	// console.log("stack:", stack);

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