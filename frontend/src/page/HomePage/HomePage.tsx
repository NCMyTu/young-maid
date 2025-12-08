import React from "react";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";

function HomePage(): React.JSX.Element {
	const pushScreen = useScreenStack((state) => state.push);

	return (
		<>
			<p>This is Home</p>
			<button
				onClick={() => pushScreen("shop")}
			>
				Click to switch to Shop
			</button>
		</>
	);
}

export default HomePage;