import { Server, Socket, type DefaultEventsMap, type ExtendedError } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import type { UserJwtPayload } from "@/api/user/user.type.js";
import PlayerQueue from "@/game/queue/queue.js";

const socketAuth = (jwtSecret: string) => {
	return (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		next: (err?: ExtendedError | undefined) => void
	) => {
		try {
			const rawCookie = socket.handshake.headers.cookie;
			if (!rawCookie)
				return next(new Error("No cookies found"));

			const parsedCookie = cookie.parse(rawCookie);
			if (!parsedCookie.token)
				return next(new Error("No token"));

			const decoded = jwt.verify(
				parsedCookie.token,
				jwtSecret,
				{ algorithms: ["HS256"] }
			) as UserJwtPayload;

			socket.data.userId = decoded.sub;

			next();
		} catch (err) {
			next(new Error("Authentication error"));
		}
	}
};

const beginSocket = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	jwtSecret: string
) => {
	const playerQueue = new PlayerQueue();

	io.use(socketAuth(jwtSecret));

	io.on("connection", (socket) => {
		const playerId = socket.data.userId;
		console.log(`player ${playerId} connected`);

		socket.on("interactWithQueue", () => {
			if (playerQueue.has(playerId))
				playerQueue.remove(playerId);
			else
				playerQueue.add(playerId);

			console.log("queue:", playerQueue.queue);

			socket.emit("playerState", {
				isInQueue: playerQueue.has(playerId),
				queueSize: playerQueue.size
			});

			io.emit("queueSize", playerQueue.size);
		});

		socket.on("disconnect", () => {
			console.log(`player ${playerId} disconnected`);
			playerQueue.remove(playerId);
		});
	});
};

export { beginSocket };