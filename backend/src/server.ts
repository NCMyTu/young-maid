import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as userRouter } from "@/api/user/user.route.js";
import {
	router as itemRouter,
	adminRouter as itemAdminRouter
} from "@/api/item/item.route.js";
import { errorHandler } from "@/middleware/error.miwa.js";
import corsOptions from "@/config/cors-options.js";
import allowedOrigins from "@/config/allowed-origins.js";
import { connectDB } from "@/config/db.config.js";
import { beginSocket } from "@/socket/socket.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret)
	throw new Error("Cannot get JWT_SECRET");

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		credentials: true,
	}
});

// Setup.
// TODO: implement rate limit.
app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());
app.use("/upload", express.static("upload"));

// Routes.
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
app.use("/admin/api/items", itemAdminRouter);

beginSocket(io, jwtSecret)

// Handling errors.
app.use(errorHandler);

// Start server.
const PORT = Number(process.env.PORT) || 5001;

async function startServer() {
	try {
		await connectDB();
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (e) {
		console.log("Failed to connect to database:", e);
		process.exit(1);
	}
}

startServer();