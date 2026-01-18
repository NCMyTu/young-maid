import type { Response, Request, NextFunction } from "express";
import { verifyUserJwtToken } from "@/api/user/user.service.js";
import type { UserJwtPayload } from "@/api/user/user.type.js";

interface UserRequest extends Request {
	user?: UserJwtPayload;
}

const authenticateUser = (req: UserRequest, res: Response, next: NextFunction) => {
	const token = req.cookies.token;

	if (!token)
		return res.status(401).json({ message: "Authentication token is required" });

	try {
		const decoded = verifyUserJwtToken(token);
		req.user = decoded;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

const authorizeUser = (roles: string[]) => {
	return (req: UserRequest, res: Response, next: NextFunction) => {
		if (roles.length === 0)
			throw new Error("\"roles\" must not be empty. Add \"all\" to explicitly allow all users");

		const userRole = req.user?.role;

		if (!userRole)
			return res.status(403).json({ message: "User role not found in token" });

		if (roles.includes("all"))
			return next();

		if (!roles.includes(userRole))
			return res.status(403).json({ message: "Insufficient permission" });

		next();
	};
};

export { authenticateUser, authorizeUser };