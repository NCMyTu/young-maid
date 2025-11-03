import { Document, Types } from "mongoose";

interface IGameId {
	displayName: string,
	tagline: string
}

interface IUser extends Document {
	_id: Types.ObjectId,
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

interface CreateUserResponse extends Pick<IUser, "_id" | "gameId" | "role" | "createdAt"> { }

export type { IGameId, IUser, CreateUserInput, CreateUserResponse };