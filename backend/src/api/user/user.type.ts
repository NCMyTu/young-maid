import { Document, Types } from "mongoose";

interface IGameId {
	displayName: string,
	tagline: string
}

interface IUser extends Document{
	_id: Types.ObjectId,
	username: string,
	password: string,
	email: string,
	gameId: IGameId,
	createdAt: Date,
	updatedAt: Date,
	// comparePassword(passwordToTest: string): Promise<boolean>
}

type CreateUserInput = {
	username: string,
	password: string,
	email: string,
	displayName: string,
	tagline: string
}

type CreateUserResponse = {
	_id: Types.ObjectId,
	gameId: IGameId,
	createdAt: Date
}

export type { IGameId, IUser, CreateUserInput, CreateUserResponse };