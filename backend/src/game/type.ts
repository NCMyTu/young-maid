export type PlayerId = string;

export type RoomId = string;

export enum PlayerState {
	Idle = "idle",
	InQueue = "inQueue",
	InGame = "inGame"
}

export type Suit = "club" | "spade" | "heart" | "diamond";
// Starts from 1 so we can if (!card).
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
	onEnter?: () => any;
	onUpdate?: () => any;
	onExpire?: () => any // Only exists if durationMs exists.
};