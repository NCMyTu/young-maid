import { Server, Socket, type DefaultEventsMap, type ExtendedError } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import type { UserJwtPayload } from "@/api/user/user.type.js";
import Maestro from "@/game/maestro.js";
import type {
	Card,
	GameEvent,
	MakeMatchResult,
	PlayerId,
	RoomId,
} from "@/game/type.js";
import { getPlayerInfos } from "@/api/user/user.service.js";
import { sleepForMs } from "@/util/util.js";

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

	const potentialMatchQueue: PlayerId[][] = [];

	io.use(socketAuth);

	setInterval(() => {
		io.emit("queueSize", maestro.getQueueSize());
	}, 3500);

	// Make match
	setInterval(() => {
		const makeMatchResult: MakeMatchResult | undefined = maestro.makeMatch();
		if (!makeMatchResult)
			return;

		potentialMatchQueue.push(makeMatchResult.players);

		makeMatchResult.players.forEach(playerId => {
			io.to(playerId).emit("matchFound");
		});
	}, 300);

	// Find players' info
	// Put it here to decouple async from match-making setInterval loop
	async function matchWorker() {
		while (true) {
			const playerIds: PlayerId[] | undefined = potentialMatchQueue.shift();
			if (!playerIds) {
				await sleepForMs(150);
				continue;
			}

			try {
				const playerInfos: {
					id: string;
					displayName: string;
					tagLine: string;
					avatar: string
				}[] = await getPlayerInfos(playerIds);

				playerIds.forEach(playerId => {
					io.to(playerId).emit("playerInfo", playerInfos);
				});
			} finally {
				await sleepForMs(150);
			}
		}
	}
	matchWorker();

	// Room update
	setInterval(() => {
		const roomsToDestroy: RoomId[] = [];

		for (const [roomId, room] of maestro.roomIdToRoom) {
			room.update();

			const event: GameEvent | undefined = room.getAndRemoveEvent();
			if (!event)
				continue;

			for (const pId of room.players)
				if ("state" in event)
					io.to(pId).emit("gameUpdate", { ...event, state: event.state[pId] });
				else
					io.to(pId).emit("gameUpdate", event);

			if (event.type === "gameEnd")
				roomsToDestroy.push(roomId);
		}

		for (const roomId of roomsToDestroy)
			maestro.destroyRoom(roomId);
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