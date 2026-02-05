
import type { Request } from "express";
import type { UserJwtPayload } from "@/api/user/user.type.js";

interface UserRequest extends Request {
	user: UserJwtPayload
}

export type {
	UserRequest
};