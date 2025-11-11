import User from "./user.model.js";
import { getMissingFields } from "../../util/util.js";
import type { HydratedDocument } from "mongoose";
import type { IUser, CreateUserInput, CreateUserResponse, UserJwtPayload } from "./user.type.js";
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
		id: savedUser.id,
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

const signinUser = async (username: string, password: string, durationInSeconds: number): Promise<string> => {
	const user = await verifyUser(username, password);
	if (!user)
		throw new SigninError("Invalid username or password");
	return generateUserJwtToken(user.id, user.role, durationInSeconds);
};

const generateUserJwtToken = (userId: string, userRole: string, durationInSeconds: number): string => {
	const jwt_secret = process.env.JWT_SECRET;
	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");

	return jwt.sign(
		{ id: userId, role: userRole },
		jwt_secret,
		{ expiresIn: `${durationInSeconds}s` }
	);
};

const verifyUserJwtToken = (token: any): UserJwtPayload => {
	const jwt_secret = process.env.JWT_SECRET;

	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");

	return jwt.verify(token, jwt_secret) as UserJwtPayload;
};

export {
	getAllUsers,
	deleteAllUsers,
	createUser,
	signinUser,
	verifyUser,
	verifyUserJwtToken
};