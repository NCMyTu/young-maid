class SigninError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SigninError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export { SigninError };