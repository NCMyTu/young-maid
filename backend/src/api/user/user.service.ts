import { getMissingFields } from "@/util/util.js";
import type { HydratedDocument } from "mongoose";
import type { UserRole, DbUser, CreateUserInput, CreateUserResult, SigninUserResult, UserJwtPayload } from "./user.type.js";
import { User } from "./user.model.js";
import jwt from "jsonwebtoken";
import { SigninError } from "@/util/error.js";
import type { PlayerId, PlayerInfo } from "@/game/type.js";

const getAllUsers = async (): Promise<HydratedDocument<DbUser>[]> => {
	return await User.find().sort({ "createdAt": -1 });
};

const createUser = async (createUserInput: CreateUserInput): Promise<CreateUserResult> => {
	const { username, password, email, displayName, tagLine } = createUserInput;
	const requiredFields = { username, password, email, displayName };
	const missingFields: string = getMissingFields(requiredFields, true);

	if (missingFields)
		throw new Error(`Missing required field(s): ${missingFields}`);

	const tempUser: HydratedDocument<DbUser> = new User({
		username, password, email, displayName, tagLine
	});
	const user = await tempUser.save();

	return {
		id: user.id,
		displayName: user.displayName,
		tagLine: user.tagLine,
		role: user.role,
		avatar: user.avatar,
		createdAt: user.createdAt
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
		throw new SigninError();

	return {
		auth: { token: generateUserJwtToken(user.id, user.role, durationInSeconds) },
		id: user.id,
		displayName: user.displayName,
		tagLine: user.tagLine,
		role: user.role,
		avatar: user.avatar,
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
	const user: HydratedDocument<DbUser> | null = await User.findById(userId, "id displayName tagLine role avatar gold gem");

	return !user ? null : {
		id: user.id,
		displayName: user.displayName,
		tagLine: user.tagLine,
		role: user.role,
		avatar: user.avatar,
		gold: user.gold,
		gem: user.gem
	};
}

const getPlayerInfos = async (playerIds: PlayerId[]): Promise<{
	id: string;
	displayName: string;
	tagLine: string;
	avatar: string
}[]> => {
	const queried = await User.find(
		{ _id: { $in: playerIds } },
		"id displayName tagLine avatar"
	).lean();

	const res = queried.map(player => ({
		id: player._id.toString(),
		displayName: player.displayName,
		tagLine: player.tagLine,
		avatar: player.avatar
	}));

	return res;
}

export {
	getAllUsers,
	deleteAllUsers,
	createUser,
	signinUser,
	verifyUser,
	verifyUserJwtToken,
	getPlayerInfos,
	getUserInfo
};