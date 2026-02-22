export type PlayerId = string;

export type RoomId = string;

export enum PlayerState {
	Idle = "idle",
	InQueue = "inQueue",
	InGame = "inGame"
}

export type Suit = "club" | "spade" | "heart" | "diamond";
export type Card = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type PlayerHand = {
	suit: Suit;
	cards: Set<Card>;
	cardToBid?: Card;
	point: number
};

export type RoomState = {
	expectedInput: boolean;
	suit: Suit;
	prizesFaceDown: Card[];
	prizesFaceUp: Card[];
	playerStates: Map<PlayerId, PlayerHand>;
};