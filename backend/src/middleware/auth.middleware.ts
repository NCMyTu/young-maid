import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface UserRequest extends Request {
	userToken?: string | JwtPayload;
}

const authenticateUser = async (req: UserRequest, res: Response, next: NextFunction) => {
	// Expects "Bearer <token>"
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) 
		return res.status(401).json({ message: "Authorization token is required" });

	try {
		const jwt_secret = process.env.JWT_SECRET;
		if (!jwt_secret) {
			throw new Error("JWT_SECRET is not defined");
		}

		const decoded = jwt.verify(token, jwt_secret);
		req.userToken = decoded;

		next();
	} catch (_) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

export { authenticateUser };