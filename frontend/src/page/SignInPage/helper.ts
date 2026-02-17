import { ENDPOINTS } from "@/config/endpoints";
import type { UserSignInResponse } from "@/type/user.type";

type SignInResult = {
	success: true;
	user: UserSignInResponse;
} | {
	success: false;
	message: string;
};

const signIn = async (username: string, password: string): Promise<SignInResult> => {
	try {
		const res = await fetch(ENDPOINTS.AUTH.signIn, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ username, password }),
		});

		if (!res.ok) {
			switch (res.status) {
				case 401: // Peekaboo! Magic number!
					throw new Error("Incorrect username or password");
				default:
					throw new Error("Something went wrong.");
			}
		}

		const user: UserSignInResponse = (await res.json()).user as UserSignInResponse;

		return {
			success: true,
			user
		};
	} catch (e: any) {
		return {
			success: false,
			message: e.message ?? "Unexpected error occurred",
		};
	}
};

export { signIn, type SignInResult };