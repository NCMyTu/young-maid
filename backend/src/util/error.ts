class LoginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "LoginError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export { LoginError };