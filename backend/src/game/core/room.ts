import type { Card, PlayerHand, PlayerId, RoomId, RoomState, Suit } from "@/game/type.js";
import { shuffleInPlace } from "@/game/util.js";

export default class GameRoom {
	id: RoomId;
	players: PlayerId[];
	state: RoomState;

	constructor(id: string, players: PlayerId[]) {
		if (players.length > 3)
			throw new Error("3+ player game is not implemented");

		this.id = id;
		this.players = players;
		this.state = this.getInitState(players);
	}

	getInitState(players: PlayerId[]): RoomState {
		const suits: Suit[] = ["club", "spade", "heart", "diamond"];
		const cards: Card[] = Array.from({ length: 13 }, (_, i) => i as Card);
		const playerStates: Map<PlayerId, PlayerHand> = new Map();

		shuffleInPlace(suits);

		players.forEach((playerId, i) =>
			playerStates.set(playerId, {
				suit: suits[i + 1]!, // Starts from 1, suits[0] is for room suit.
				cards: new Set(cards),
				cardToBid: undefined,
				point: 0
			})
		);

		shuffleInPlace(cards);

		return {
			expectedInput: true,
			suit: suits[0]!,
			prizesFaceDown: cards,
			prizesFaceUp: [],
			playerStates
		};
	}
}