import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	const options = {serverSelectionTimeoutMS: 7000};
	try {
		const db_uri = process.env.MONGODB_URI;

		if (!db_uri)
			throw new Error("process.env.MONGODB_URI is missing.");

		await mongoose.connect(db_uri, options);
		console.log("Connected to database");
	} catch (e) {
		throw e;
	}
}

export { connectDB };