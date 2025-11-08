import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface UserJwtPayload extends JwtPayload {
	id: string,
	role: string
}

interface UserRequest extends Request {
	userToken?: UserJwtPayload;
}

const getJwtSecret = (): string => {
	const jwt_secret = process.env.JWT_SECRET;
	if (!jwt_secret)
		throw new Error("Cannot get JWT_SECRET");
	return jwt_secret
}

const authenticateUser = (req: UserRequest, res: Response, next: NextFunction) => {
	// Expects "Bearer <token>"
	const authHeader = req.headers.authorization;
	const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
	if (!token)
		return res.status(401).json({ message: "Authorization token is required" });

	try {
		const decoded = jwt.verify(token, getJwtSecret());
		req.userToken = decoded as UserJwtPayload;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

const authorizeUser = (roles: string[]) => {
	return (req: UserRequest, res: Response, next: NextFunction) => {
		if (roles.length === 0)
			throw new Error("\"roles\" must not be empty. Add \"all\" to explicitly allow all users");

		const userRole = req.userToken?.role;

		if (!userRole)
			return res.status(403).json({ message: "User role not found in token" });

		if (roles.includes("all"))
			return next()

		if (!roles.includes(userRole))
			return res.status(403).json({ message: "Insufficient permission" });

		next();
	};
};

export { authenticateUser, authorizeUser };