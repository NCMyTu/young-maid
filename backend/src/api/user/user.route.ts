import express from "express";
import {
	signinUserController,
	createUserController,
	resetPasswordRequest,
	updateUser,
	getAllUsersController,
	deleteAllUsersController
} from "./user.controller.js";
import { authenticateUser, authorizeUser } from "../../middleware/auth.miwa.js";

const router = express.Router();

// Public
router.post("/signin", signinUserController);
router.post("/signup", createUserController);
router.post("/forget-password", resetPasswordRequest);
// Protected
// TODO: remove access when user is deleted and token is still in use.
router.use(authenticateUser);
router.get("/", authorizeUser(["all"]), getAllUsersController);
router.post("/", updateUser);
router.delete("/", deleteAllUsersController);

export default router;