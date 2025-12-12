import express from "express";
import type { Response } from "express";
import { authenticateUser, authorizeUser } from "@/middleware/auth.miwa.js";
import {
	createShopItemAdminController,
	getShopItemsController,
	getShopItemsAdminController
} from "./item.controller.js";

// *** = to be implemented
// TODO: remove access when user is deleted and token is still in use.

// IMPORTANT:
// Don't use router.use(<middleware>) since it applies to all routes that follow.
// Instead attach middlewares explicitly in each router.<method>.

const routeNotFound = (_: any, res: Response) => {
	res.status(404).json({ message: "Route not found" });
}

const router = express.Router();
router.get("/shop", authenticateUser, getShopItemsController);
router.all(/(.*)/, routeNotFound);

const adminRouter = express.Router();
adminRouter.get("/shop", authenticateUser, authorizeUser(["admin"]), getShopItemsAdminController);
adminRouter.post("/shop", authenticateUser, authorizeUser(["admin"]), createShopItemAdminController);
adminRouter.all(/(.*)/, routeNotFound);

export {
	router,
	adminRouter
};