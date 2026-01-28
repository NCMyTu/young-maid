import { capitalize } from "./util.js";

export class SigninError extends Error {
	constructor() {
		super("Incorrect username or password");
		this.name = "SigninError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class InvalidOrMissingAuthToken extends Error {
	constructor() {
		super("Invalid or missing auth token");
		this.name = "InvalidOrMissingAuthToken";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class AuthorizationError extends Error {
	constructor() {
		super("Insufficient permission");
		this.name = "AuthorizationError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class MissingFileError extends Error {
	constructor(whatFile?: string) {
		const prefix = whatFile ? `${capitalize(whatFile)} file` : "File";
		super(`${prefix} missing`);
		this.name = "MissingFileError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class UnsupportedFileTypeError extends Error {
	constructor(fileType?: string) {
		const suffix = fileType ? `: ${fileType.toLowerCase()}` : "";
		super(`Unsupported file type${suffix}`);
		this.name = "UnsupportedFileTypeError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class InvalidItemTypeError extends Error {
	constructor(type: unknown) {
		super(`Invalid item type: ${String(type)}`);
		this.name = "InvalidItemTypeError";
		Error.captureStackTrace?.(this, this.constructor);
	}
}