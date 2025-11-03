import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface UserJwtPayload extends JwtPayload {
	_id: string,
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
		// Verify token
		const decoded = jwt.verify(token, getJwtSecret()) as UserJwtPayload;
		// Attach userToken to request
		req.userToken = decoded;
		next();
	} catch (_) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

const authorizeUser = (roles: string[]) => {
	return (req: UserRequest, res: Response, next: NextFunction) => {
		if (roles.length === 0) {
			console.warn("Roles array is empty. If you want all users to access this endpoint, add \"all\" to suppress this warning");
			return next();
		}

		const userRole = req.userToken?.role;

		if (!userRole)
			return res.status(403).json({ message: "User role must be in token" });

		if (roles.includes("all"))
			return next()

		if (!roles.includes(userRole))
			return res.status(403).json({ message: "Insufficient Permission" });

		next();
	};
};

export { authenticateUser, authorizeUser };