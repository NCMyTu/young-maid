import express from "express";
import {
	signinUserController,
	createUserController,
	resetPasswordController,
	updateUserController,
	getAllUsersController,
	deleteAllUsersController,
	verifyTokenController,
	signoutController
} from "./user.controller.js";
import { authenticateUser, authorizeUser } from "@/middleware/auth.miwa.js";
import type { Response } from "express";

// TODO: log user out if there are multiple sign in.

// *** = to be implemented
// TODO: remove access when user is deleted and token is still in use.

// IMPORTANT:
// Don't use router.use(<middleware>) since it applies to all routes that follow.
// Instead attach middlewares explicitly in each router.<method>.

const router = express.Router();

router.post("/auth/signin", signinUserController);
router.post("/auth/signup", createUserController);
router.post("/auth/forget-password", resetPasswordController); // ***
router.get("/auth/verify", verifyTokenController);
router.post("/auth/signout", signoutController);

router.get("/", authenticateUser, authorizeUser(["admin"]), getAllUsersController);
router.post("/", authenticateUser, updateUserController); // ***
router.delete("/", authenticateUser, deleteAllUsersController);

router.all(/(.*)/, (_, res: Response) => {
	res.status(404).json({ message: "Route not found" });
});

export {
	router
};