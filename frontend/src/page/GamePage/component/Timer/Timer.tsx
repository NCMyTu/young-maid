import React, { useEffect, useState } from "react";
import styles from "./Timer.module.css";
import type { TimerProps } from "./Timer.type";
import clsx from "clsx";

function Timer({
	timerEnd,
	className,
	onEnd
}: TimerProps): React.JSX.Element | null {
	const [now, setNow] = useState<number>(Date.now());

	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, []);

	const secondsLeft: number = Math.max(0, Math.ceil((timerEnd - now) / 1000));

	useEffect(() => { secondsLeft === 0 && onEnd?.(); }, [secondsLeft]);

	if (secondsLeft <= 0)
		return null;

	return <span
		className={clsx(
			styles.container,
			className,
			secondsLeft <= 3 ? styles.red : ""
		)}>
		{secondsLeft}
	</span>;
}

export default Timer;