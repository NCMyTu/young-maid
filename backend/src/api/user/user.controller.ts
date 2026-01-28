import { AuthorizationError, InvalidOrMissingAuthToken } from "@/util/error.js";
import {
	createUser,
	getAllUsers,
	deleteAllUsers,
	signinUser,
	verifyUserJwtToken,
	getUserInfo
} from "./user.service.js";
import type { RequestHandler } from "express";
import type { SigninUserResult } from "./user.type.js";

const getAllUsersController: RequestHandler = async (_, res) => {
	//  TODO:
	// addd query keywords.
	// reject (send 400) invalid query keywords.
	const users = await getAllUsers();
	res.status(200).json(users);
};

const createUserController: RequestHandler = async (req, res) => {
	const { username, password, email, displayName, tagLine } = req.body;
	// May throw mongoose.Error.
	const user = await createUser({ username, password, email, displayName, tagLine });
	res.status(201).json({ message: "User created successfully.", user });
};

const deleteAllUsersController: RequestHandler = async (_, res) => {
	// May throw mongoose.Error.
	const deletedCount = await deleteAllUsers();
	res.status(200).json({ message: `Deleted ${deletedCount} users.` });
};

const signinUserController: RequestHandler = async (req, res) => {
	const maxAgeMinutes = process.env.JWT_COOKIE_MAX_AGE_MINUTES;
	if (!maxAgeMinutes)
		throw new Error("Cannot get JWT_COOKIE_MAX_AGE_MINUTES");
	const durationSeconds = Number(maxAgeMinutes) * 60;

	// May throw SigninError.
	const userData: SigninUserResult = await signinUser(req.body.username, req.body.password, durationSeconds);

	res.cookie("token", userData.auth.token, {
		httpOnly: true,
		sameSite: "strict",
		secure: false, // TODO: true if over https.
		maxAge: 1000 * durationSeconds
	});

	res.status(200).json({
		message: "Signin successful.",
		id: userData.id,
		displayName: userData.displayName,
		tagLine: userData.tagLine,
		gold: userData.gold,
		gem: userData.gem,
		role: userData.role
	});
};

const resetPasswordController: RequestHandler = async (_, res) => {
	res.status(200).json("hi from forget password.");
};

const updateUserController: RequestHandler = async (_, res) => {
	res.status(200).json("hi from update.");
};

const verifyTokenController: RequestHandler = async (req, res) => {
	const token = req.cookies.token;

	if (!token || typeof token !== "string")
		throw new InvalidOrMissingAuthToken();

	const { id, role } = verifyUserJwtToken(token);
	const user = await getUserInfo(id);

	if (!user || user.role !== role)
		throw new AuthorizationError();

	res.status(200).json({ message: "OK", user });
};

const signoutController: RequestHandler = (_, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		sameSite: "strict",
		secure: false, // TODO: true if over https
		expires: new Date(0)
	});
	res.sendStatus(200);
};

export {
	signinUserController,
	createUserController,
	resetPasswordController,
	updateUserController,
	getAllUsersController,
	deleteAllUsersController,
	verifyTokenController,
	signoutController
};