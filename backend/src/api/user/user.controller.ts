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
		const { username, password, email, displayName, tagline } = req.body;
		const user = await createUser({ username, password, email, displayName, tagline });
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
	const durationInSeconds = 60 * 5;

	try {
		const userData = await signinUser(req.body.username, req.body.password, durationInSeconds);

		res.cookie("token", userData.jwt, {
			httpOnly: true,
			sameSite: "strict",
			secure: false, // TODO: true if over https
			maxAge: 1000 * durationInSeconds
		});

		res.status(200).json({
			message: "Signin successful",
			jwt: userData.jwt,
			id: userData.id,
			displayName: userData.displayName,
			tagline: userData.tagline,
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

	if (!token) {
		res.status(401).json({ message: "Not authenticated" });
		return;
	}

	try {
		const { id, role: roleFromToken } = verifyUserJwtToken(token);
		const user = await getUserInfo(id);

		if (!user || user.role !== roleFromToken)
			throw new Error("Role may be updated and got stale");

		res.status(200).json({ message: "OK" , user});
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