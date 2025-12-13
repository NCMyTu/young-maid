import type { JwtPayload } from "jsonwebtoken";

type UserRole = "admin" | "user";

interface DbUser {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;

	username: string;
	password: string;
	email: string;
	displayName: string;
	tagLine: string;
	role: UserRole
};

interface DbUserMethods {
	comparePassword(against: string): Promise<boolean>
}

type CreateUserInput = Omit<DbUser, "role">;
type CreateUserResult = Pick<DbUser, "id" | "displayName" | "tagLine" | "role" | "createdAt">;

type SigninUserResult = Pick<
	DbUser,
	"id" | "displayName" | "tagLine" | "role"
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