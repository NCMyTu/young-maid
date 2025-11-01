// 3 hours just to write this little.

import User from "./user.model.js";
import { getMissingFields } from "../../util/util.js";
import type { HydratedDocument } from "mongoose";
import type { IUser, CreateUserInput, CreateUserResponse } from "./user.type.js";

const getAllUsers = async () => {
	try {
		return await User.find().sort({"createdAt": -1});
	} catch (e) {
		throw e;
	}
};

const createUser = async ({
	username,
	password,
	email,
	displayName,
	tagline
}: CreateUserInput): Promise<CreateUserResponse> => {
	const requiredFields = {username, password, email, displayName};
	const missingFieldsStr = getMissingFields(requiredFields, true);

	if (missingFieldsStr)
		throw new Error(`Missing required field(s): ${missingFieldsStr}`)

	const newUser: HydratedDocument<IUser> = new User({
		username, password, email,
		gameId: { displayName, tagline }
	});
	const savedUser = await newUser.save();
	return {
		_id: savedUser._id,
		gameId: savedUser.gameId,
		createdAt: savedUser.createdAt
	};
};

const deleteAllUsers = async () => {
	return (await User.deleteMany()).deletedCount;
}

export {
	getAllUsers,
	deleteAllUsers,
	createUser
}