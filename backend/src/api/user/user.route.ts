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
import type { Response, Request } from "express";

const router = express.Router();

// *** = to be implemented
// TODO: remove access when user is deleted and token is still in use.

// IMPORTANT:
// Don't use router.use(<middleware>) since it applies to all routes that follow.
// Instead attach middlewares explicitly in each router.<method>.

// Public routes
router.post("/auth/signin", signinUserController);
router.post("/auth/signup", createUserController);
router.post("/auth/forget-password", resetPasswordController); // ***
router.get("/auth/verify", verifyTokenController);
router.post("/auth/signout", signoutController);

// Protected routes
router.get("/", authenticateUser, authorizeUser(["all"]), getAllUsersController);
router.post("/", authenticateUser, updateUserController); // ***
router.delete("/", authenticateUser, deleteAllUsersController);

// Catch-all route
router.all(/(.*)/, (_: Request, res: Response) => {
	res.status(404).json({ message: "Route not found" });
});

export default router;