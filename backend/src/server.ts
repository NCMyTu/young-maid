import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.config.js";
import cors from "cors";
import corsOptions from "./config/cors-options.js";
import cookieParser from "cookie-parser";
import userRouter from "./api/user/user.route.js";
import itemRouter from "./api/item/item.route.js";

dotenv.config();

const app = express();

// TODO: implement rate limit

// Setup
app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());
// Routes
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);

// Start server
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