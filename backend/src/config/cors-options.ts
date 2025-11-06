import type { CorsOptions } from "cors";
import allowedOrigins from "./allowed-origins.js";

const corsOptions: CorsOptions = {
	origin: (origin: string | undefined, callback: any) => {
		if (!origin || allowedOrigins.indexOf(origin) !== -1)
			callback(null, true);
		else
			callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	optionsSuccessStatus: 200
};

export default corsOptions;