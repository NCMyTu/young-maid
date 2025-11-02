import { SigninError } from "../../util/error.js";
import { createUser, getAllUsers, deleteAllUsers, signinUser } from "./user.service.js";
import type { Request, Response } from "express";

const getAllUsersController = async (_: Request, res: Response) => {
	//  TODO:
	// addd query keywords
	// reject (send 400) invalid query keywords
	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch (e) {
		res.status(500).json({message: "Something went wrong while trying to get all users."});
	}
};

const createUserController = async (req: Request, res: Response) => {
	try {
		const {username, password, email, gameId} = req.body;
		const {displayName, tagline} = gameId;
		const user = await createUser({username, password, email, displayName, tagline});
		res.status(201).json({message: "User created successfully.", user});
	} catch (e) {
		const msg = e instanceof Error ? e.message : "An unknown error occurred";
		res.status(409).json({message: msg});
	}
};

const deleteAllUsersController = async (_: Request, res: Response) => {
	try {
		const deletedCount = await deleteAllUsers();
		res.status(200).json({ message: `deleted ${deletedCount} users` });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "An unknown error occurred";
		res.status(500).json({ message: msg });
	}
};

const signinUserController = async (req: Request, res: Response) => {
	try {
		const loginToken = await signinUser(req.body.username, req.body.password);
		res.status(200).json({ loginToken });
	} catch (e) {
		if (e instanceof SigninError)
			res.status(400).json({ message: "Invalid username or password" });
		else
			res.status(500).json({ message: "Unexpected error" });
	}
};

async function resetPasswordRequest(_: Request, res: Response) {
	res.status(200).json("hi from forget password");
}

async function updateUser(_: Request, res: Response) {
	res.status(200).json("hi from update");
}

export {
	signinUserController,
	createUserController,
	resetPasswordRequest,
	updateUser,
	getAllUsersController,
	deleteAllUsersController
};