import React, { useEffect, useState } from "react";
import styles from "./GamePage.module.css";
import clsx from "clsx";

import Card from "./component/Card/Card";
import PlayerInfo from "./component/PlayerInfo/PlayerInfo";
import Points from "./component/Points/Points";
import Timer from "./component/Timer/Timer";
import type { GameEvent, PublicBoardState } from "./type";
import GameEndModal from "@/component/Modal/GameEndModal";

import usePlayerInfo from "@/lib/store/player-info/player-info";
import { socket } from "@/lib/socket";
import useUser from "@/lib/store/user/user";

import { API_BASE_URL } from "@/config/endpoints";

const PLACEHOLDER_GAME_STATE: PublicBoardState = {
	suit: "spade",
	nPrizesFaceDown: 13,
	prizesFaceUp: [],
	players: {}
};

function GamePage(): React.JSX.Element {
	const [gameState, setGameState] = useState<PublicBoardState>(PLACEHOLDER_GAME_STATE);
	const idSelf = useUser((state) => state.id);
	const playerInfo = usePlayerInfo((state) => state.info);

	const [bidsRevealed, setBidsRevealed] = useState(false);

	const [timerEnd, setTimerEnd] = useState<number | undefined>(undefined);

	const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
	const [isWinner, setIsWinner] = useState<boolean>(false);

	useEffect(() => {
		const updateGame = (gameEvent: GameEvent) => {
			if ("state" in gameEvent)
				setGameState(gameEvent.state);

			switch (gameEvent.type) {
				case "revealBids":
					setBidsRevealed(true);
					break;
				case "cleanUpBidsAndPrizes":
					setBidsRevealed(false);
					break;

				case "waitForBids":
					setTimerEnd(gameEvent.timerEnd);
					break;
				case "waitForBids_end":
					setTimerEnd(undefined);
					break;

				case "gameEnd":
					setIsGameEnd(true);
					setIsWinner(gameEvent.winners.includes(idSelf));
					break;
			}
		};
		socket.on("gameUpdate", updateGame);

		return () => {
			socket.off("gameUpdate", updateGame);
		};
	}, []);

	return (<>
		<GameEndModal
			isOpen={isGameEnd}
			isWinner={isWinner}
		/>

		<div className={styles.container}>
			{/* --- Player info --- */}
			{playerInfo.map((info) => (
				<PlayerInfo
					key={info.id}
					avatar={`${API_BASE_URL}/${info.avatar}`}
					displayName={info.displayName}
					tagLine={info.displayName}
					className={info.id === idSelf ? styles.playerSelf : styles.playerOpponent}
				/>
			))}

			{/* --- Board layout --- */}
			{Object.entries(gameState.players).map(([playerId, hand]) => (
				<React.Fragment key={playerId}>
					<Points
						points={hand.point}
						className={playerId === idSelf ? styles.pointsSelf : styles.pointsOpponent}
					/>

					{/* - Bids - */}
					{hand.hasBid && (
						<Card
							isFaceDown={playerId !== idSelf && !bidsRevealed}
							suit={hand.suit}
							value={hand.cardToBid}
							className={clsx(
								styles.bid,
								playerId === idSelf ? styles.bidSelf : styles.bidOpponent
							)}
						/>
					)}

					{/* - Hands - */}
					{hand.visibility === "self"
						?
						<div className={clsx(styles.hand, styles.handSelf)}>
							{hand.cards.map((card) => (
								<Card
									key={`${playerId}-${card}`}
									suit={hand.suit}
									value={card}
									isHoverable={true}
									onClick={() => socket.emit("gameInput", card)}
								/>
							))}
						</div>
						:
						<div className={clsx(styles.hand, styles.handOpponent)}>
							{Array.from({ length: hand.nCards }).map((_, i) => (
								<Card isFaceDown={true} key={`${playerId}-${i}`} />
							))}
						</div>
					}
				</React.Fragment>
			))}

			{/* --- Timer --- */}
			{timerEnd !== undefined && <Timer
				timerEnd={timerEnd}
				className={styles.timer}
				onEnd={() => setTimerEnd(undefined)}
			/>}

			{/* --- Number of prizes left --- */}
			<div className={styles.nPrizes}>
				<span>Prizes left:</span>
				<span>{gameState.nPrizesFaceDown}</span>
			</div>

			{/* --- Face-up prizes --- */}
			<div className={clsx(styles.hand, styles.prizes)}>
				{gameState.prizesFaceUp.map((card) => (
					<Card
						key={card}
						suit={gameState.suit}
						value={card}
					/>
				))}
			</div>
		</div>
	</>);
}

export default GamePage;