import express from "express";
import {
	loginUser,
	createUserController,
	resetPasswordRequest,
	updateUser,
	getAllUsersController,
	deleteAllUsersController
} from "./user.controller.js";


const router = express.Router();

router.get("/", getAllUsersController);
router.post("/", createUserController);
router.post("/login", loginUser);
router.post("/forget-password", resetPasswordRequest);
router.post("/update", updateUser);
router.delete("/", deleteAllUsersController);

export default router;