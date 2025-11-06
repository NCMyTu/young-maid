import dotenv from "dotenv";
import express from "express";
import userRouter from "./api/user/user.route.js";
import { connectDB } from "./config/db.config.js";
import cors from "cors";
import corsOptions from "./config/cors-options.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));

app.use("/api/users", userRouter);

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