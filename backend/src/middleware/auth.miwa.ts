import type { NextFunction, Response, Request, RequestHandler } from "express";
import { verifyUserJwtToken } from "@/api/user/user.service.js";
import type { UserJwtPayload } from "@/api/user/user.type.js";
import { AuthorizationError, InvalidOrMissingAuthToken } from "@/util/error.js";

interface UserRequest extends Request {
	user?: UserJwtPayload;
}

const authenticateUser: RequestHandler = (req: UserRequest, _: Response, next: NextFunction) => {
	const token = req.cookies.token;
	if (!token)
		throw new InvalidOrMissingAuthToken();

	try {
		req.user = verifyUserJwtToken(token);
		next();
	} catch {
		throw new InvalidOrMissingAuthToken();
	}
};

const authorizeUser = (roles: string[]): RequestHandler => {
	if (roles.length === 0)
		throw new Error("\"roles\" must not be empty. Add \"all\" to explicitly allow all users");

	return (req: UserRequest, _: Response, next: NextFunction) => {
		const userRole = req.user?.role;

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