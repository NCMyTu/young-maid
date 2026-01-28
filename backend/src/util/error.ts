class SigninError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SigninError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

class FileNotFoundError extends Error {
	readonly code = "EOENT";
	constructor() {
		super("File not found");
		this.name = "FileNotFoundError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

class InvalidItemTypeError extends Error {
	constructor(type: unknown) {
		super(`Invalid item type: ${String(type)}`);
		this.name = "InvalidItemTypeError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export {
	FileNotFoundError,
	InvalidItemTypeError,
	SigninError
 };