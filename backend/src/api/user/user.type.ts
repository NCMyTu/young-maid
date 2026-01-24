import type { JwtPayload } from "jsonwebtoken";

type UserRole = "admin" | "user";

interface DbUser {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	username: string;
	password: string;
	email: string;
	role: UserRole;
	displayName: string;
	tagLine: string;
	gold: number;
	gem: number
};

interface DbUserMethods {
	comparePassword(against: string): Promise<boolean>
}

type CreateUserInput = Pick<DbUser, "username" | "password" | "email" | "displayName" | "tagLine">;
type CreateUserResult = Pick<DbUser, "id" | "displayName" | "tagLine" | "role" | "createdAt">;

type SigninUserResult = Pick<
	DbUser,
	"id" | "displayName" | "tagLine" | "role" | "gold" | "gem"
> & {
	auth: {
		token: string
	}
};

interface UserJwtPayload extends JwtPayload {
	sub: string, // user.id
	role: UserRole
}

export type {
	UserRole,
	DbUser,
	DbUserMethods,
	CreateUserInput,
	CreateUserResult,
	SigninUserResult,
	UserJwtPayload
};