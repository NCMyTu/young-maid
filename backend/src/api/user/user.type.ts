import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";

interface IGameId {
	displayName: string,
	tagline: string
}

interface IUser extends Document {
	_id: Types.ObjectId,
	id: string,
	username: string,
	password: string,
	email: string,
	role: "user" | "admin",
	gameId: IGameId,
	createdAt: Date,
	updatedAt: Date
	comparePassword(passwordToTest: string): Promise<boolean>
}

interface CreateUserInput extends Pick<IUser, "username" | "password" | "email"> {
	displayName: string;
	tagline: string;
}

interface CreateUserResponse extends Pick<IUser, "id" | "gameId" | "role" | "createdAt"> { }

interface UserJwtPayload extends JwtPayload {
	id: string,
	role: string
}

export type {
	IGameId,
	IUser,
	CreateUserInput,
	CreateUserResponse,
	UserJwtPayload
};