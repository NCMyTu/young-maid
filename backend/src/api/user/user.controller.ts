import { SigninError } from "@/util/error.js";
import {
	createUser,
	getAllUsers,
	deleteAllUsers,
	signinUser,
	verifyUserJwtToken,
	getUserInfo
} from "./user.service.js";
import type { Request, Response } from "express";
import type { SigninUserResult } from "./user.type.js";

const getAllUsersController = async (_: Request, res: Response): Promise<void> => {
	//  TODO:
	// addd query keywords
	// reject (send 400) invalid query keywords
	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch {
		res.status(500).json({ message: "Something went wrong while trying to get all users" });
	}
};

const createUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password, email, displayName, tagLine } = req.body;
		const user = await createUser({ username, password, email, displayName, tagLine });
		res.status(201).json({ message: "User created successfully.", user });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(409).json({ message: msg });
	}
};

const deleteAllUsersController = async (_: Request, res: Response): Promise<void> => {
	try {
		const deletedCount = await deleteAllUsers();
		res.status(200).json({ message: `deleted ${deletedCount} users` });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unexpected error";
		res.status(500).json({ message: msg });
	}
};

const signinUserController = async (req: Request, res: Response): Promise<void> => {
	const maxAgeMinutes = process.env.JWT_COOKIE_MAX_AGE_MINUTES;
	if (!maxAgeMinutes)
		throw new Error("Cannot get JWT_COOKIE_MAX_AGE_MINUTES");
	const durationSeconds = Number(maxAgeMinutes) * 60;

	try {
		const userData: SigninUserResult = await signinUser(req.body.username, req.body.password, durationSeconds);

		res.cookie("token", userData.auth.token, {
			httpOnly: true,
			sameSite: "strict",
			secure: false, // TODO: true if over https
			maxAge: 1000 * durationSeconds
		});

		res.status(200).json({
			message: "Signin successful",
			id: userData.id,
			displayName: userData.displayName,
			tagline: userData.tagLine,
			role: userData.role
		});
	} catch (e) {
		if (e instanceof SigninError)
			res.status(401).json({ message: "Incorrect username or password" });
		else
			res.status(500).json({ message: "Unexpected error" });
	}
};

async function resetPasswordController(_: Request, res: Response): Promise<void> {
	res.status(200).json("hi from forget password");
}

async function updateUserController(_: Request, res: Response): Promise<void> {
	res.status(200).json("hi from update");
}

async function verifyTokenController(req: Request, res: Response): Promise<void> {
	const token = req.cookies.token;

	if (!token || typeof token !== "string") {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}

	try {
		const { sub: id, role } = verifyUserJwtToken(token);
		const user = await getUserInfo(id);

		if (!user || user.role !== role) {
			res.status(401).json({ message: "Unauthorized: Role mismatch" });
			return;
		}

		res.status(200).json({ message: "OK", user });
	} catch {
		res.status(401).json({ message: "Invalid or expired token" });
	}
}

function signoutController(_: Request, res: Response): void {
	res.cookie("token", "", {
		httpOnly: true,
		sameSite: "strict",
		secure: false, // TODO: true if over https
		expires: new Date(0)
	});
	res.sendStatus(200);
}

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