import React, { useEffect, useState } from "react";
import styles from "./GamePage.module.css";
import clsx from "clsx";

import Card from "./component/Card/Card";
import PlayerInfo from "./component/PlayerInfo/PlayerInfo";
import Points from "./component/Points/Points";
import type { CardProps } from "./component/Card/Card.type";

import usePlayerInfo from "@/lib/store/player-info/player-info";
import { socket } from "@/lib/socket";
import useUser from "@/lib/store/user/user";

import { API_BASE_URL } from "@/config/endpoints";

const Bid = (props: CardProps) => (<Card {...props} />);

function GamePage(): React.JSX.Element {
	const [events, setEvents] = useState<any[]>([]);
	const idSelf = useUser((state) => state.id);
	const playerInfo = usePlayerInfo((state) => state.info);

	useEffect(() => {
		const catchAll = (eventName: string, ...args: any[]) => {
			if (eventName === "queueSize")
				return;

			setEvents(prev => [
				...prev,
				{ eventName, data: args }
			]);
		};
		socket.onAny(catchAll);

		return () => {
			socket.offAny(catchAll);
		};
	}, []);

	return <div className={styles.container}>
		<div className={styles.events}>
			{events.map((event, index) => (
				<div key={index}>
					<strong>{event.eventName}</strong>:{" "}
					{JSON.stringify(event.data)}
				</div>
			))}
		</div>

		{playerInfo.map((info) => (
			<PlayerInfo
				key={info.id}
				avatar={`${API_BASE_URL}/${info.avatar}`}
				displayName={info.displayName}
				tagLine={info.displayName}
				className={info.id === idSelf ? styles.playerSelf : styles.playerOpponent}
			/>
		))
		}

		<Points
			points={200}
			className={styles.pointsSelf}
		/>
		<Bid
			suit="spade"
			value={1}
			className={clsx(styles.bid, styles.bidSelf)}
		/>

		<Points
			points={111}
			className={styles.pointsOpponent}
		/>
		<Bid
			suit="spade"
			value={1}
			className={clsx(styles.bid, styles.bidOpponent)}
		/>

		<div className={styles.nPrizes}>
			<span>Prizes left:</span>
			<span>{13}</span>
		</div>

		<div className={clsx(styles.hand, styles.prizes)}>
			{Array.from({ length: 13 }, (_, i) => (
				<Card
					key={i}
					suit="diamond"
					value={i + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13}
				/>
			))}
		</div>

		<div className={clsx(styles.hand, styles.handSlef)}>
			{Array.from({ length: 13 }, (_, i) => (
				<Card
					key={i}
					suit="diamond"
					value={i + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13}
					isHoverable={true}
				/>
			))}
		</div>

		<div className={clsx(styles.hand, styles.handOpponent)}>
			<Card
				isFaceDown={true}
			/>
		</div>
	</div>;
}

export default GamePage;