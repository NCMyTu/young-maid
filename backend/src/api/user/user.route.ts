import express from "express";
import {
	signinUserController,
	createUserController,
	resetPasswordRequest,
	updateUser,
	getAllUsersController,
	deleteAllUsersController
} from "./user.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.post("/signin", signinUserController);
router.post("/signup", createUserController);
router.post("/forget-password", resetPasswordRequest);
// Protected
router.use(authenticateUser);
router.get("/", getAllUsersController);
router.post("/update", updateUser);
router.delete("/", deleteAllUsersController);

export default router;