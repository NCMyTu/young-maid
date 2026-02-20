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
	avatar: string;
	displayName: string;
	tagLine: string;
	gold: number;
	gem: number
};

interface DbUserMethods {
	comparePassword(against: string): Promise<boolean>
}

type CreateUserInput = Pick<DbUser, "username" | "password" | "email" | "displayName" | "tagLine">;
type CreateUserResult = Pick<DbUser, "id" | "displayName" | "tagLine" | "role" | "avatar" | "createdAt">;

type SigninUserResult = Pick<
	DbUser,
	"id" | "displayName" | "tagLine" | "role" | "avatar" | "gold" | "gem"
> & {
	auth: {
		token: string
	}
};

type UpdatedUserCurrency = Pick<DbUser, "id" | "gold" | "gem">;

interface UserJwtPayload extends JwtPayload {
	sub: string, // user.id
	id: string,
	role: UserRole
}

export type {
	UserRole,
	DbUser,
	DbUserMethods,
	CreateUserInput,
	CreateUserResult,
	SigninUserResult,
	UpdatedUserCurrency,
	UserJwtPayload
};