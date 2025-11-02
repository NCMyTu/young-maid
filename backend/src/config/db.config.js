import mongoose from "mongoose";

const connectDB = async () => {
	const options = {serverSelectionTimeoutMS: 7000};
	try {
		await mongoose.connect(process.env.MONGODB_URI, options);
		console.log("Connected to database");
	} catch (e) {
		throw e;
	}
}

export {connectDB};