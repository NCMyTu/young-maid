import { Server, Socket, type DefaultEventsMap, type ExtendedError } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import type { UserJwtPayload } from "@/api/user/user.type.js";
import Maestro from "@/game/maestro.js";
import type {
	Card,
	GameEvent,
	MakeMatchResult,
	PlayerId
} from "@/game/type.js";

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
	const FPS = 4;
	const maestro = new Maestro();

	io.use(socketAuth);

	setInterval(() => {
		io.emit("queueSize", maestro.getQueueSize());
	}, 3500);

	setInterval(() => {
		const makeMatchResult: MakeMatchResult | undefined = maestro.makeMatch();
		if (!makeMatchResult)
			return;

		makeMatchResult.players.forEach(playerId => {
			io.to(playerId).emit("matchFound");
			// TODO: sent player data (name, avatar...)
		});

	}, 300);

	setInterval(() => {
		maestro.roomIdToRoom.forEach((room) => {
			room.update();

			const event: GameEvent | undefined = room.getAndRemoveEvent();
			if (!event)
				return;
		})
	}, 1000 / FPS);

	io.on("connection", (socket: Socket) => {
		const playerId: PlayerId = socket.data.userId as PlayerId;

		socket.join(playerId);

		socket.emit("playerState", maestro.getPlayerState(playerId));
		socket.emit("queueSize", maestro.getQueueSize());

		socket.on("interactWithQueue", () => {
			maestro.handlePlayerInteractWithQueue(playerId);

			socket.emit("playerState", maestro.getPlayerState(playerId));
			socket.emit("queueSize", maestro.getQueueSize());
		});

		socket.on("gameInput", (card: Card) => {
			maestro.handleInput(playerId, card);
		})

		socket.on("disconnect", () => {
			maestro.removePlayerFromQueue(playerId);
		});
	});
};

export { beginSocket };