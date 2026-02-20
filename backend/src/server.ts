import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.config.js";
import cors from "cors";
import corsOptions from "./config/cors-options.js";
import cookieParser from "cookie-parser";
import { router as userRouter } from "@/api/user/user.route.js";
import {
	router as itemRouter,
	adminRouter as itemAdminRouter
} from "@/api/item/item.route.js";
import { errorHandler } from "@/middleware/error.miwa.js";

dotenv.config();

const app = express();

// TODO: implement rate limit

// Setup.
app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());
app.use("/upload", express.static("upload"));

// Routes.
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
app.use("/admin/api/items", itemAdminRouter);

// Handling errors.
app.use(errorHandler);

// Start server.
const PORT = Number(process.env.PORT) || 5001;
connectDB()
	.then(() =>
		app.listen(PORT, () =>
			console.log(`Server is running on port ${PORT}`))
	)
	.catch((e) => {
		console.log("Failed to connect to database:", e);
		process.exit(1);
	}
);