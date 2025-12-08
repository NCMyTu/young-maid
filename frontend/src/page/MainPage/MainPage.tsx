import React from "react";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import HomePage from "@/page/HomePage/HomePage";
import ShopPage from "@/page/ShopPage/ShopPage";

function MainPage(): React.JSX.Element {
	const currentScreen = useScreenStack((state) => state.current());
	const stack = useScreenStack((state) => state.stack);

	console.log("stack:", stack);

	const screenToRender = (() => {
		switch (currentScreen) {
			case "home":
				return <HomePage />;
			case "shop":
				return <ShopPage />;
			default:
				return <HomePage />;
		}
	})();

	return <>{screenToRender}</>;
};

export default MainPage;