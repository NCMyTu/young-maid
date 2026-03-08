import type {
	BoardState,
	Card,
	GameEvent,
	GameInput,
	PhaseHandler,
	PlayerHand,
	PlayerId,
	PublicBoardState,
	PublicBoardStateForPlayer,
	RoomId,
	Suit
} from "@/game/type.js";
import { RoomPhase } from "@/game/type.js";
import { isCard, isPlayerId, shuffleInPlace } from "@/game/util.js";

// TODO: WRITE DOCS!!!!!!!!!

const ALL_CARDS: readonly Card[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const WAITING_ON_START_DURATION_SEC = 3;
const WAITING_FOR_BIDS_DURATION_SEC = 10;
const REVEALING_BIDS_DURATION_SEC = 1;
const DETERMINE_WINNER_AND_POINTS_DURATION_SEC = 2;
const NETWORK_LATENCY_BUFFER_MS = 100;

class GameRoom {
	id: RoomId;
	players: PlayerId[];

	phase: RoomPhase;
	boardState: BoardState;
	timerEnd?: number;
	phaseHandlers: Record<RoomPhase, PhaseHandler>;
	eventQueue: GameEvent[];

	lastRoundWasDraw: boolean;

	constructor(id: string, players: PlayerId[]) {
		if (players.length > 3)
			throw new Error("3+ player game is not implemented");

		this.id = id;
		this.players = players;

		this.phase = RoomPhase.waitingOnStart;
		this.boardState = this.getInitBoardState(players);
		this.timerEnd = undefined;

		this.phaseHandlers = this.createPhaseHandlers();
		this.eventQueue = [];

		this.lastRoundWasDraw = false;

		this.transitionTo(RoomPhase.waitingOnStart);
	}

	createPhaseHandlers(): Record<RoomPhase, PhaseHandler> {
		return {
			[RoomPhase.waitingOnStart]: {
				durationMs: WAITING_ON_START_DURATION_SEC * 1000,

				onEnter: () => {},

				onExpire: () => {
					this.registerEvent({
						type: "firstState",
						state: this.getPublicBoardState()
					});

					this.transitionTo(RoomPhase.revealingPrizes);
				}
			},

			[RoomPhase.revealingPrizes]: {
				onEnter: () => {
					this.revealPrizes();
					this.registerEvent({
						type: "revealPrizes",
						state: this.getPublicBoardState()
					});
					this.transitionTo(RoomPhase.waitingForBids);
				}
			},

			[RoomPhase.waitingForBids]: {
				durationMs: WAITING_FOR_BIDS_DURATION_SEC * 1000,

				onEnter: () => {
					this.registerEvent({ type: "waitForBids", timerEnd: this.timerEnd });
				},

				onExpire: () => {
					this.registerEvent({ type: "waitForBids_end" });
					this.transitionTo(RoomPhase.resolvingMissingInput);
				},

				onUpdate: () => {
					if (this.areAllInputsSubmitted()) {
						this.registerEvent({ type: "waitForBids_end" });
						this.transitionTo(RoomPhase.revealingBids);
					}
				},
			},

			[RoomPhase.revealingBids]: {
				durationMs: REVEALING_BIDS_DURATION_SEC * 1000,

				onEnter: () => {
					this.registerEvent({
						type: "revealBids",
						state: this.getPublicBoardState(true)
					});
				},

				onExpire: () => {
					this.transitionTo(RoomPhase.determineWinnerAndPoints);
				},
			},

			[RoomPhase.determineWinnerAndPoints]: {
				durationMs: DETERMINE_WINNER_AND_POINTS_DURATION_SEC * 1000,

				onEnter: () => {
					const isDraw: boolean = !this.determineWinnerAndPoints();

					if (isDraw)
						this.registerEvent({
							type: "determineWinnerAndPoints",
							isDraw: true,
							state: this.getPublicBoardState(true)
						});
					else
						this.registerEvent({
							type: "determineWinnerAndPoints",
							isDraw: false,
							state: this.getPublicBoardState(true)
						});
				},

				onExpire: () => {
					this.transitionTo(RoomPhase.cleaningUpBidsAndPrizes);
				}
			},

			[RoomPhase.cleaningUpBidsAndPrizes]: {
				onEnter: () => {
					this.cleanUpBidsAndPrizes();
					this.registerEvent({
						type: "cleanUpBidsAndPrizes",
						state: this.getPublicBoardState()
					});
					this.transitionTo(RoomPhase.determineGameEnd);
				}
			},

			[RoomPhase.determineGameEnd]: {
				onEnter: () => {
					if (this.canEndGame())
						this.transitionTo(RoomPhase.gameEnd);
					else
						this.transitionTo(RoomPhase.revealingPrizes);
				}
			},

			[RoomPhase.gameEnd]: {
				onEnter: () => {
					this.registerEvent({
						type: "gameEnd",
						winners: this.determineGameWinners()
					});
				}
			},

			[RoomPhase.resolvingMissingInput]: {
				// BREAKING: This phase doesn't directly transition to RoomPhase.revealingBids,
				// but the game still proceeds normally.
				//
				// Flow:
				// - Timer expires -> resolvingMissingInput
				// - resolveMissingInput() fills missing bids
				// - waitingForBids.onUpdate() from the previous handler still runs
				// - All bids submitted -> transitions to revealingBids
				//
				// Ideally this should be handled through explicit state transitions instead
				// of relying on this side effect.
				// Since it still "works", let's leave it like this for now 🙏
				onEnter: () => {
					this.resolveMissingInput();
					this.registerEvent({
						type: "resolveMissingInput",
						state: this.getPublicBoardState()
					});
				}
			}
		};
	}

	getInitBoardState(players: PlayerId[]): BoardState {
		const suits: Suit[] = ["club", "spade", "heart", "diamond"];
		const cards: Card[] = [...ALL_CARDS];

		shuffleInPlace(suits);

		const playerStates: Map<PlayerId, PlayerHand> = new Map();
		players.forEach((playerId, i) =>
			playerStates.set(playerId, {
				suit: suits[i + 1]!, // Starts from 1, suits[0] is prize suit.
				cards: new Set(cards),
				cardToBid: undefined,
				point: 0
			})
		);

		shuffleInPlace(cards);

		return {
			suit: suits[0]!,
			prizesFaceDown: new Set(cards),
			prizesFaceUp: [],
			playerStates
		};
	}

	getPublicBoardStateFor(playerId: PlayerId, revealBids = false): PublicBoardStateForPlayer {
		const publicBoardStateForPlayer: PublicBoardStateForPlayer = {
			suit: this.boardState.suit,
			nPrizesFaceDown: this.boardState.prizesFaceDown.size,
			prizesFaceUp: this.boardState.prizesFaceUp,
			players: {}
		}

		this.boardState.playerStates.forEach((playerHand, _playerId) => {
			if (playerId === _playerId)
				publicBoardStateForPlayer.players[_playerId] = {
					suit: playerHand.suit,
					hasBid: playerHand.cardToBid ? true : false,
					cardToBid: playerHand.cardToBid,
					point: playerHand.point,
					visibility: "self",
					cards: Array.from(playerHand.cards)
				};
			else
				publicBoardStateForPlayer.players[_playerId] = {
					suit: playerHand.suit,
					hasBid: playerHand.cardToBid ? true : false,
					cardToBid: revealBids ? playerHand.cardToBid : undefined,
					point: playerHand.point,
					visibility: "other",
					nCards: playerHand.cards.size,
				};
		});

		return publicBoardStateForPlayer;
	}

	getPublicBoardState(revealBids = false): PublicBoardState {
		const publicBoardState: PublicBoardState = {};
		this.players.forEach(playerId => {
			publicBoardState[playerId] = this.getPublicBoardStateFor(playerId, revealBids);
		});
		return publicBoardState;
	}

	setTimer(ms: number): void {
		this.timerEnd = Date.now() + ms + NETWORK_LATENCY_BUFFER_MS;
	}

	clearTimer(): void {
		this.timerEnd = undefined;
	}

	registerEvent(event: GameEvent): void {
		this.eventQueue.push(event);
	}

	getAndRemoveEvent(): GameEvent | undefined {
		return this.eventQueue.shift();
	}

	/** Returns result of `onEnter`
	 */
	transitionTo(phase: RoomPhase): void {
		this.clearTimer();

		this.phase = phase;

		const handler = this.phaseHandlers[phase];

		if (handler.durationMs)
			this.setTimer(handler.durationMs);

		return handler.onEnter?.();
	}

	areAllInputsSubmitted(): boolean {
		return Array.from(
			this.boardState.playerStates.values()
		).every(playerHand => playerHand.cardToBid !== undefined);
	}

	validateInput({ playerId, card }: GameInput): boolean {
		return isPlayerId(playerId) && isCard(card);
	}

	applyInput({ playerId, card }: GameInput): boolean {
		if (!this.validateInput({ playerId, card }))
			return false;

		if (this.phase !== RoomPhase.waitingForBids)
			return false;

		const playerHand: PlayerHand | undefined = this.boardState.playerStates.get(playerId);
		if (!playerHand || playerHand.cardToBid || !playerHand.cards.has(card))
			return false;

		playerHand.cardToBid = card;
		playerHand.cards.delete(card);

		this.registerEvent({
			type: "receivedPlayerInput",
			state: this.getPublicBoardState()
		});

		return true;
	}

	update(): void {
		const handler = this.phaseHandlers[this.phase];

		if (this.timerEnd && Date.now() > this.timerEnd) {
			this.clearTimer();
			if (handler.onExpire)
				handler.onExpire();
		}

		if (handler.onUpdate)
			handler.onUpdate();
	}

	/** Remove a random card from face-down prizes and add it to face-up prizes.
	 */
	revealPrizes(): void  {
		const remainingPrizes: Card[] = Array.from(this.boardState.prizesFaceDown);

		if (remainingPrizes.length === 0)
			return;

		const nextPrize = remainingPrizes[
			Math.floor(Math.random() * remainingPrizes.length)
		]!;

		this.boardState.prizesFaceDown.delete(nextPrize);
		this.boardState.prizesFaceUp.push(nextPrize);
	}

	/** Choose random cards for missing inputs.
	 */
	resolveMissingInput(): void {
		for (const [_, playerHand] of this.boardState.playerStates) {
			if (playerHand.cardToBid !== undefined)
				continue;

			// Remaining cards
			const rCards: Card[] = Array.from(playerHand.cards);
			if (rCards.length === 0)
				continue;

			const newCardToBid: Card = rCards[Math.floor(Math.random() * rCards.length)]!;

			playerHand.cards.delete(newCardToBid);
			playerHand.cardToBid = newCardToBid;
		}
	}

	/** Returns `true` if there is an only winner with highest card, `false` otherwise. */
	determineWinnerAndPoints(): boolean {
		let winner: { playerId: PlayerId, card: Card } | undefined;
		let isDraw = false;

		for (const [playerId, playerHand] of this.boardState.playerStates) {
			if (playerHand.cardToBid === undefined)
				continue;

			if (!winner || playerHand.cardToBid > winner.card) {
				isDraw = false;
				winner = { playerId: playerId, card: playerHand.cardToBid }
			} else if (playerHand.cardToBid === winner.card) {
				isDraw = true;
			}
		}

		if (!winner || isDraw) {
			this.lastRoundWasDraw = true;
			return false;
		}

		const points: number = this.boardState.prizesFaceUp.reduce((acc, curr) => acc + curr, 0);
		this.boardState.playerStates.get(winner.playerId)!.point += points;

		this.lastRoundWasDraw = false;
		return true;
	}

	cleanUpBidsAndPrizes(): void {
		if (!this.lastRoundWasDraw)
			this.boardState.prizesFaceUp = [];

		this.boardState.playerStates.forEach((playerHand, _) => {
			playerHand.cardToBid = undefined;
		});
	}

	canEndGame(): boolean {
		return this.boardState.prizesFaceDown.size === 0;
	}

	determineGameWinners(): PlayerId[] {
		let winners: PlayerId[] = [];
		let highestPoint = -Infinity;

		for (const [playerId, playerHand] of this.boardState.playerStates) {
			if (playerHand.point > highestPoint) {
				highestPoint = playerHand.point;
				winners = [playerId];
			} else if (playerHand.point === highestPoint){
				winners.push(playerId);
			}
		}

		return winners;
	}
}

export default GameRoom;