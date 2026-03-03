import { create } from "zustand";
import type { PlayerInfo, PlayerInfoState } from "./player-info.type";

const usePlayerInfo = create<PlayerInfoState>()((set, _) => ({
	isSet: false,
	info: [],

	setPlayerInfo: (info: PlayerInfo[]): void => set((_) => ({ isSet: true, info })),
	clear: (): void => set((_) => ({ isSet: false, info: [] })),
}));

export default usePlayerInfo;