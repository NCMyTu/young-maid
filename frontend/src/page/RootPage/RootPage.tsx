import React, { useEffect } from "react";
import { ENDPOINTS } from "@/config/endpoints";
import usePlayerInfo from "@/lib/store/player-info/player-info";
import type { PlayerInfo } from "@/lib/store/player-info/player-info.type";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import useUser from "@/lib/store/user/user";
import HomePage from "@/page/HomePage/HomePage";
import InventoryPage from "@/page/InventoryPage/InventoryPage";
import ShopPage from "@/page/ShopPage/ShopPage";
import AdminPage from "@/page/AdminPage/AdminPage";
import GamePage from "@/page/GamePage/GamePage";
import { socket } from "@/lib/socket";

function RootPage(): React.JSX.Element {
	const setUser = useUser((state) => state.setUser);
	const clearUser = useUser((state) => state.clear);
	const setPlayerInfo = usePlayerInfo((state) => state.setPlayerInfo);

	useEffect(() => {
		const process = (info: PlayerInfo[]) => {
			setPlayerInfo(info);
		};
		socket.on("playerInfo", process);

		return () => {
			socket.off("playerInfo", process);
		};
	}, []);

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
			case "game":
				return <GamePage />;
			default:
				return <div>Whatcha doin here? GTFO!!!</div>;
		}
	})();

	return <>{screenToRender}</>;
};

export default RootPage;