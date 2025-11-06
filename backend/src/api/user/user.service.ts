import User from "./user.model.js";
import { getMissingFields } from "../../util/util.js";
import type { HydratedDocument } from "mongoose";
import type { IUser, CreateUserInput, CreateUserResponse } from "./user.type.js";
import jwt from "jsonwebtoken";
import { SigninError } from "../../util/error.js";

const getAllUsers = async () => {
	return await User.find().sort({ "createdAt": -1 });
};

const createUser = async (createUserInput: CreateUserInput): Promise<CreateUserResponse> => {
	const { username, password, email, displayName, tagline } = createUserInput;
	const requiredFields = { username, password, email, displayName };
	const missingFields: string = getMissingFields(requiredFields, true);

	if (missingFields)
		throw new Error(`Missing required field(s): ${missingFields}`);

	const newUser: HydratedDocument<IUser> = new User({
		username, password, email,
		gameId: { displayName, tagline }
	});

	const savedUser = await newUser.save();

	return {
		_id: savedUser._id,
		gameId: savedUser.gameId,
		role: savedUser.role,
		createdAt: savedUser.createdAt
	};
};

const deleteAllUsers = async (): Promise<number> => {
	return (await User.deleteMany()).deletedCount;
};

const verifyUser = async (username: string, password: string): Promise<HydratedDocument<IUser> | null> => {
	const user = await User.findOne({ username: username });
	if (!user)
		return null;
	if (!(await user.comparePassword(password)))
		return null;
	return user;
};

const signinUser = async (username: string, password: string): Promise<string> => {
	const jwt_secret = process.env.JWT_SECRET;
	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");

	const user = await verifyUser(username, password);

	if (!user)
		throw new SigninError("Invalid username or password");

	return jwt.sign(
		{ _id: user.id, role: user.role },
		jwt_secret,
		{ expiresIn: "1H" }
	);
};

export {
	getAllUsers,
	deleteAllUsers,
	createUser,
	signinUser,
	verifyUser
};