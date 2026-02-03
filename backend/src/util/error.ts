import { capitalize } from "./util.js";

export class SigninError extends Error {
	constructor() {
		super("Incorrect username or password");
		this.name = "SigninError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidOrMissingAuthToken extends Error {
	constructor() {
		super("Invalid or missing auth token");
		this.name = "InvalidOrMissingAuthToken";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class AuthorizationError extends Error {
	constructor() {
		super("Insufficient permission");
		this.name = "AuthorizationError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class MissingFileError extends Error {
	constructor(whatFile?: string) {
		const prefix = whatFile ? `${capitalize(whatFile)} file` : "File";
		super(`${prefix} missing`);
		this.name = "MissingFileError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class UnsupportedFileTypeError extends Error {
	constructor(fileType?: string) {
		const suffix = fileType ? `: ${fileType.toLowerCase()}` : "";
		super(`Unsupported file type${suffix}`);
		this.name = "UnsupportedFileTypeError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidDataError extends Error {
	constructor(field?: string, value?: string) {
		const suffix = field
			? value !== undefined
				? `: ${field} = ${value}`
				: `: ${field}`
			: "";
		super(`Invalid data/field${suffix}`);
		this.name = "InvalidDataError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ResourceNotFoundError extends Error {
	constructor(resourceName?: string, reason?: string) {
		const prefix = resourceName ? `${capitalize(resourceName)}` : "Resource";
		const suffix = reason ? `: ${reason}` : "";
		super(`${prefix} not found${suffix}`);
		this.name = "ResourceNotFoundError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class PurchaseNotAllowedError extends Error {
	constructor(reason: string) {
		super(reason);
		this.name = "PurchaseNotAllowedError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InternalInconsistencyError extends Error {
	constructor(reason: string) {
		super(reason);
		this.name = "InternalInconsistencyError";
		Error.captureStackTrace(this, this.constructor);
	}
}