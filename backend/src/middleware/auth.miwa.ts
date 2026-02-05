import type { NextFunction, Request, Response, RequestHandler } from "express";
import { verifyUserJwtToken } from "@/api/user/user.service.js";
import { AuthorizationError, InvalidOrMissingAuthToken } from "@/util/error.js";
import type { UserRequest } from "@/util/request.js";

const authenticateUser: RequestHandler = (req, _, next) => {
	const userReq = req as UserRequest;

	const token = userReq.cookies.token;
	if (!token)
		throw new InvalidOrMissingAuthToken();

	try {
		userReq.user = verifyUserJwtToken(token);
		userReq.user.id = userReq.user.sub;
		next();
	} catch {
		throw new InvalidOrMissingAuthToken();
	}
};

const authorizeUser = (roles: string[]): RequestHandler => {
	if (roles.length === 0)
		throw new Error("\"roles\" must not be empty. Add \"all\" to explicitly allow all users");

	return (req: Request, _: Response, next: NextFunction) => {
		const userRole = (req as UserRequest).user.role;

		if (!userRole)
			throw new Error("User role is somehow missing in auth token");

		if (roles.includes("all"))
			return next();

		if (!roles.includes(userRole))
			throw new AuthorizationError();

		next();
	};
};

export { authenticateUser, authorizeUser };