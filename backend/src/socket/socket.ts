import { Server, Socket, type DefaultEventsMap, type ExtendedError } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import type { UserJwtPayload } from "@/api/user/user.type.js";
import Maestro from "@/game/maestro.js";
import type { PlayerId } from "@/game/type.js";

const socketAuth = (
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
			process.env.JWT_SECRET!,
			{ algorithms: ["HS256"] }
		) as UserJwtPayload;

		socket.data.userId = decoded.sub;

		next();
	} catch (e) {
		console.log("socket auth error", e);
		next(new Error("Authentication error"));
	}
};

const beginSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
	const maestro = new Maestro();
	const playerIdToSocket = new Map<PlayerId, Socket>();

	setInterval(() => {
		console.log("--------\nqueue:", maestro.queue);
		console.log("rooms:", maestro.rooms, "\n--------");
	}, 5000);

	io.use(socketAuth);

	// --------------------------

	setInterval(() => {
		io.emit("queueSize", maestro.getQueueSize());
	}, 3000);

	setInterval(() => {
		const res = maestro.makeMatch();
		if (!res)
			return;

		res.players.forEach(playerId => {
			const socket = playerIdToSocket.get(playerId);
			socket?.join(res.roomId);
		});

		io.to(res.roomId).emit("matchFound");
	}, 300);

	io.on("connection", (socket: Socket) => {
		const playerId = socket.data.userId as PlayerId;

		playerIdToSocket.set(playerId, socket);

		socket.emit("playerState", maestro.getPlayerState(playerId));
		socket.emit("queueSize", maestro.getQueueSize());

		socket.on("interactWithQueue", () => {
			maestro.handlePlayerInteractWithQueue(playerId);

			socket.emit("playerState", maestro.getPlayerState(playerId));
			socket.emit("queueSize", maestro.getQueueSize());
		});

		socket.on("disconnect", () => {
			maestro.removePlayerFromQueue(playerId);
			playerIdToSocket.delete(playerId);
		});
	});
};

export { beginSocket };