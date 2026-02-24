import type {
	PlayerId,
	RoomId,
	BoardState,
	PublicBoardStateForPlayer,
	Suit,
	Card,
	PlayerHand,
	PublicBoardState,
	PhaseHandler
} from "@/game/type.js";
import { RoomPhase } from "@/game/type.js";
import { shuffleInPlace } from "@/game/util.js";

// TODO: WRITE DOCS!!!!!!!!!

const WAITING_ON_START_DURATION_SECONDS = 3;
const WAITING_FOR_BIDS_DURATION_SECONDS = 10;

class GameRoom {
	id: RoomId;
	players: PlayerId[];

	phase: RoomPhase;
	boardState: BoardState;
	timer?: number;
	phaseHandlers: Record<RoomPhase, PhaseHandler>;
	eventQueue: any[];

	constructor(id: string, players: PlayerId[]) {
		if (players.length > 3)
			throw new Error("3+ player game is not implemented");

		this.id = id;
		this.players = players;

		this.phase = RoomPhase.waitingOnStart;
		this.boardState = this.getInitBoardState(players);
		this.timer = undefined;

		this.phaseHandlers = this.createPhaseHandlers();
		this.eventQueue = [];

		this.transitionTo(RoomPhase.waitingOnStart);
	}

	createPhaseHandlers(): Record<RoomPhase, PhaseHandler> {
		return {
			[RoomPhase.waitingOnStart]: {
				durationMs: WAITING_ON_START_DURATION_SECONDS * 1000,

				onEnter: () => {
					this.registerEvent({
						type: "firstState",
						state: this.getPublicBoardState()
					});
				},

				onExpire: () => {
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
				durationMs: WAITING_FOR_BIDS_DURATION_SECONDS * 1000,

				onEnter: () => {
					this.registerEvent({type: "waitForBids"})
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
				onEnter: () => {
					this.registerEvent({
						type: "revealBids",
						state: this.getPublicBoardState()
					});
					this.transitionTo(RoomPhase.determineWinnerAndPoints);
				},
			},

			[RoomPhase.determineWinnerAndPoints]: {
				onEnter: () => {
					const isDraw: boolean = !this.determineWinnerAndPoints();

					if (isDraw)
						this.registerEvent({
							type: "determineWinnerAndPoints",
							isDraw: true
						});
					else
						this.registerEvent({
							type: "determineWinnerAndPoints",
							isDraw: false,
							state: this.getPublicBoardState()
						});

					this.transitionTo(RoomPhase.cleaningUpBidsAndPrizes);
				},
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
		const cards: Card[] = Array.from({ length: 13 }, (_, i) => i + 1 as Card);

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

	getPublicBoardStateFor(playerId: PlayerId): PublicBoardStateForPlayer {
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
					cardToBid: playerHand?.cardToBid,
					point: playerHand.point,
					visibility: "self",
					cards: Array.from(playerHand.cards)
				};
			else
				publicBoardStateForPlayer.players[_playerId] = {
					suit: playerHand.suit,
					cardToBid: playerHand.cardToBid,
					point: playerHand.point,
					visibility: "other",
					nCards: playerHand.cards.size
				};
		});

		return publicBoardStateForPlayer;
	}

	getPublicBoardState(): PublicBoardState {
		const publicBoardState: PublicBoardState = {};
		this.players.forEach(playerId => {
			publicBoardState[playerId] = this.getPublicBoardStateFor(playerId);
		});
		return publicBoardState;
	}

	setTimer(ms: number): void {
		this.timer = Date.now() + ms + 150; // Account for network delay
	}

	clearTimer(): void {
		this.timer = undefined;
	}

	registerEvent(event: any): void {
		this.eventQueue.push(event);
	}

	getAndRemoveEvent(): any {
		return this.eventQueue.shift();
	}

	/** Returns result of `onEnter`
	 */
	transitionTo(phase: RoomPhase): any {
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

	validateInput(input: any): boolean {
		// TODO: use type predicate instead of this.
		if (typeof input.playerId !== "string")
			return false;
		if (typeof input.card !== "number" || input.card < 1 || input.card > 13)
			return false;
		return true;
	}

	applyInput(input: any): boolean {
		if (!this.validateInput(input))
			return false;

		if (this.phase !== RoomPhase.waitingForBids)
			// return {type: "receivedInput", state: this.getPublicBoardState()}
			return false;

		const { playerId, card } = input;

		const playerHand: PlayerHand | undefined = this.boardState.playerStates.get(playerId);
		if (!playerHand || playerHand.cardToBid || !playerHand.cards.has(card))
			return false;

		playerHand.cardToBid = card;
		playerHand.cards.delete(card);

		this.registerEvent({
			type: "playerInput",
			state: this.getPublicBoardState()
		});

		return true;
	}

	update(): any {
		const handler = this.phaseHandlers[this.phase];

		if (this.timer && Date.now() > this.timer) {
			this.clearTimer();
			if (handler.onExpire)
				handler.onExpire();
		}

		if (handler.onUpdate)
			handler.onUpdate();
	}

	/** Remove a random card from face-down prizes
	 * and add it to face-up prizes.
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

			const remainingCards: Card[] = Array.from(playerHand.cards);

			const newCardToBid: Card = remainingCards[
				Math.floor(Math.random() * remainingCards.length)
			]!;

			playerHand.cards.delete(newCardToBid);
			playerHand.cardToBid = newCardToBid;
		}
	}

	/** Returns `true` if there is an only winner with highest card, `false` otherwise.
	 */
	determineWinnerAndPoints(): boolean {
		// Determine winner
		let winner: { playerId: string, card: Card } | undefined = undefined;
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

		if (!winner || isDraw)
			return false;

		const points: number = this.boardState.prizesFaceUp.reduce((acc, curr) => acc + curr, 0);
		this.boardState.playerStates.get(winner.playerId)!.point += points;

		return true;
	}

	cleanUpBidsAndPrizes(): void {
		// Cleanup
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