export type PlayerId = string;

export type Suit = "club" | "spade" | "heart" | "diamond";
// Starts from 1 so we can <if (!card)>.
export type Card = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type PublicPlayerHand = {
	suit: Suit;
	hasBid: boolean;
	cardToBid?: Card;
	point: number
} & (
	{ visibility: "self"; cards: Card[] }
	| { visibility: "other"; nCards: number }
);

export type PublicBoardState = {
	suit: Suit;
	nPrizesFaceDown: number;
	prizesFaceUp: Card[];
	players: Record<PlayerId, PublicPlayerHand>
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