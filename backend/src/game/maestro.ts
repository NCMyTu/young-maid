import { v7 as uuid_v7 } from "uuid";

import PlayerQueue from "./core/queue.js";
import GameRoom from "./core/room.js";
import { PlayerState } from "./type.js";
import type { Card, MakeMatchResult, PlayerId, RoomId } from "./type.js";

const N_PLAYERS_PER_ROOM = 2;

export default class Maestro {
	queue: PlayerQueue;
	roomIdToRoom: Map<RoomId, GameRoom>;
	playerIdToRoom: Map<PlayerId, RoomId>;

	constructor() {
		this.queue = new PlayerQueue();
		this.roomIdToRoom = new Map<RoomId, GameRoom>();
		this.playerIdToRoom = new Map<PlayerId, RoomId>();
	}

	getQueueSize(): number {
		return this.queue.size;
	}

	getPlayerState(playerId: PlayerId): PlayerState {
		if (this.queue.has(playerId))
			return PlayerState.InQueue;
		else if (this.playerIdToRoom.has(playerId))
			return PlayerState.InGame;
		else
			return PlayerState.Idle;
	}

	removePlayerFromQueue(playerId: PlayerId): boolean {
		return this.queue.remove(playerId);
	}

	/** Returns true if player successfully interact with the queue
	 * (either join or leave the queue), false otherwise.
	 */
	handlePlayerInteractWithQueue(playerId: PlayerId): boolean {
		if (this.getPlayerState(playerId) === PlayerState.InGame)
			return false;

		if (this.queue.has(playerId))
			this.queue.remove(playerId);
		else
			this.queue.add(playerId);
		return true;
	}

	/** Selects N_PLAYERS_PER_ROOM random players,
	 * creates a `GameRoom` instance,
	 * and updates internal state.
	 */
	makeMatch(): MakeMatchResult | undefined {
		const players: PlayerId[] = this.queue.getRandomPlayers(N_PLAYERS_PER_ROOM);
		if (players.length < N_PLAYERS_PER_ROOM)
			return;

		let roomId = uuid_v7();
		while (this.roomIdToRoom.has(roomId))
			roomId = uuid_v7(); // Who knows...

		const room = new GameRoom(roomId, players);

		this.roomIdToRoom.set(roomId, room);
		players.forEach(playerId => {
			this.queue.remove(playerId);
			this.playerIdToRoom.set(playerId, roomId);
		});

		return { roomId, players };
	}

	handleInput(playerId: PlayerId, card: Card): void {
		const roomId: RoomId | undefined = this.playerIdToRoom.get(playerId);
		if (!roomId)
			return;

		const room: GameRoom | undefined = this.roomIdToRoom.get(roomId);
		if (!room)
			return;

		room.applyInput({ playerId, card });
	}
}