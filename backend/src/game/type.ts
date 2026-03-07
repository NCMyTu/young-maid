// NOTE: Keep this in sync with frontend/src/page/GamePage/type.ts

export type PlayerId = string;

export type RoomId = string;

export enum PlayerState {
	Idle = "idle",
	InQueue = "inQueue",
	InGame = "inGame"
}

export type PlayerInfo = {
	id: string;
	displayName: string;
	avatar: string
};

export type MakeMatchResult = {
	roomId: string;
	players: string[];
};

export type Suit = "club" | "spade" | "heart" | "diamond";
// Starts from 1 so we can <if (!card)>.
export type Card = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type PlayerHand = {
	suit: Suit;
	cards: Set<Card>;
	cardToBid?: Card;
	point: number
};

export enum RoomPhase {
	cleaningUpBidsAndPrizes,
	determineGameEnd,
	determineWinnerAndPoints,
	gameEnd,
	resolvingMissingInput,
	revealingBids,
	revealingPrizes,
	waitingOnStart,
	waitingForBids,
}

export type BoardState = {
	suit: Suit;
	prizesFaceDown: Set<Card>;
	prizesFaceUp: Card[];
	playerStates: Map<PlayerId, PlayerHand>
};

export type PublicPlayerHand = {
	suit: Suit;
	hasBid: boolean;
	cardToBid?: Card;
	point: number
} & (
	{ visibility: "self"; cards: Card[] }
	| { visibility: "other"; nCards: number }
);

export type PublicBoardStateForPlayer = {
	suit: Suit;
	nPrizesFaceDown: number;
	prizesFaceUp: Card[];
	players: Record<PlayerId, PublicPlayerHand>
};

export type PublicBoardState = Record<PlayerId, PublicBoardStateForPlayer>;

export type PhaseHandler = {
	durationMs?: number;
	onEnter?: () => void;
	onUpdate?: () => void;
	onExpire?: () => void // Only exists if durationMs exists.
};

export type GameInput = {
	playerId: PlayerId;
	card: Card
};

export type GameEvent = {
	type: "waitForBids",
	timerEnd: number | undefined
} | {
	type: "waitForBids_end"
} | {
	type:
	"firstState"
	| "revealPrizes"
	| "revealBids"
	| "cleanUpBidsAndPrizes"
	| "resolveMissingInput"
	| "receivedPlayerInput",
	state: PublicBoardState
} | {
	type: "determineWinnerAndPoints",
	isDraw: boolean,
	state: PublicBoardState
} | {
	type: "gameEnd",
	winners: PlayerId[]
};