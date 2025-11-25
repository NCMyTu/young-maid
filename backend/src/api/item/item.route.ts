import express from "express";
import type { Response, Request } from "express";
// import { authenticateUser, authorizeUser } from "@/middleware/auth.miwa.js";
import {
	createShopItemController,
	getAllShopItemsController
} from "./item.controller.js";

const router = express.Router();

// *** = to be implemented
// TODO: remove access when user is deleted and token is still in use.

// IMPORTANT:
// Don't use router.use(<middleware>) since it applies to all routes that follow.
// Instead attach middlewares explicitly in each router.<method>.

router.get("/shop", getAllShopItemsController);
router.post("/shop", createShopItemController);

// Catch-all route
router.all(/(.*)/, (_: Request, res: Response) => {
	res.status(404).json({ message: "Route not found" });
});

export default router;