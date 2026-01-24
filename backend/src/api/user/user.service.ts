import { getMissingFields } from "@/util/util.js";
import type { HydratedDocument } from "mongoose";
import type { UserRole, DbUser, CreateUserInput, CreateUserResult, SigninUserResult, UserJwtPayload } from "./user.type.js";
import { User } from "./user.model.js";
import jwt from "jsonwebtoken";
import { SigninError } from "@/util/error.js";

const getAllUsers = async (): Promise<HydratedDocument<DbUser>[]> => {
	return await User.find().sort({ "createdAt": -1 });
};

const createUser = async (createUserInput: CreateUserInput): Promise<CreateUserResult> => {
	const { username, password, email, displayName, tagLine } = createUserInput;
	const requiredFields = { username, password, email, displayName };
	const missingFields: string = getMissingFields(requiredFields, true);

	if (missingFields)
		throw new Error(`Missing required field(s): ${missingFields}`);

	const newUser: HydratedDocument<DbUser> = new User({
		username, password, email, displayName, tagLine
	});

	const savedUser = await newUser.save();

	return {
		id: savedUser.id,
		displayName: savedUser.displayName,
		tagLine: savedUser.tagLine,
		role: savedUser.role,
		createdAt: savedUser.createdAt
	};
};

const deleteAllUsers = async (): Promise<number> => {
	return (await User.deleteMany()).deletedCount;
};

const verifyUser = async (username: string, password: string): Promise<HydratedDocument<DbUser> | null> => {
	const user = await User.findOne({ username: username });
	if (!user)
		return null;
	if (!(await user.comparePassword(password)))
		return null;
	return user;
};

const signinUser = async (
	username: string,
	password: string,
	durationInSeconds: number = 60 * 10
): Promise<SigninUserResult> => {
	const user: HydratedDocument<DbUser> | null = await verifyUser(username, password);

	if (!user)
		throw new SigninError("Invalid username or password");

	return {
		auth: { token: generateUserJwtToken(user.id, user.role, durationInSeconds) },
		id: user.id,
		displayName: user.displayName,
		tagLine: user.tagLine,
		role: user.role,
		gold: user.gold,
		gem: user.gem
	};
};

const generateUserJwtToken = (id: string, role: UserRole, durationInSeconds: number): string => {
	const jwt_secret = process.env.JWT_SECRET;
	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");

	return jwt.sign(
		{ sub: id, role },
		jwt_secret,
		{ expiresIn: `${durationInSeconds}s` }
	);
};

const verifyUserJwtToken = (token: string): UserJwtPayload => {
	const jwt_secret = process.env.JWT_SECRET;

	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");

	return jwt.verify(token, jwt_secret, { algorithms: ["HS256"] }) as UserJwtPayload;
};

const getUserInfo = async (userId: string): Promise<Partial<DbUser> | null> => {
	const user: HydratedDocument<DbUser> | null = await User.findById(userId, "id displayName tagLine role gold gem");

	if (!user)
		return null;

	return {
		id: user.id,
		displayName: user.displayName,
		tagLine: user.tagLine,
		role: user.role,
		gold: user.gold,
		gem: user.gem
	};
}

export {
	getAllUsers,
	deleteAllUsers,
	createUser,
	signinUser,
	verifyUser,
	verifyUserJwtToken,
	getUserInfo
};