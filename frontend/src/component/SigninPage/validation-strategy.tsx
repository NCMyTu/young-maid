import { cannotContainSpace, checkLength, validateInput, isEmail, isAlphanumeric, type IValidationFuncResult } from "./helper.tsx";

/*
	username: minLength: 6, cannot contain spaces, optional: bloom filter
	email: validator.isEmail
	password: min length: 6
	displayName: 3 <= length <= 35
	tagline: 2 <= length <= 6, must be alphanumeric
*/
const USERNAME_MIN_LENGTH = 6;
const PASSWORD_MIN_LENGTH = 6;
const DISPLAY_NAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 35;
const TAGLINE_MIN_LENGTH = 2;
const TAGLINE_MAX_LENGTH = 6;

const validateUsername = (input: string): IValidationFuncResult => {
	return validateInput(
		input,
		"Username",
		[   // Order matters.
			cannotContainSpace,
			(value, valueType) => checkLength(value, valueType, USERNAME_MIN_LENGTH),
		]
	);
};

const validatePassword = (input: string): IValidationFuncResult => {
	return validateInput(
		input,
		"Password",
		[
			(value, valueType) => checkLength(value, valueType, PASSWORD_MIN_LENGTH),
		]
	);
};

const validateEmail = (input: string): IValidationFuncResult => {
	return validateInput(
		input,
		"Email",
		[
			isEmail
		]
	);
};

const validateDisplayName = (input: string): IValidationFuncResult => {
	return validateInput(
		input,
		"Display name",
		[
			(value, valueType) => checkLength(value, valueType, DISPLAY_NAME_MIN_LENGTH, DISPLAY_NAME_MAX_LENGTH),
		]
	);
};

const validateTagline = (input: string): IValidationFuncResult => {
	return validateInput(
		input,
		"Tagline",
		[   // Order matters.
			isAlphanumeric,
			(value, valueType) => checkLength(value, valueType, TAGLINE_MIN_LENGTH, TAGLINE_MAX_LENGTH),
		]
	);
};

export {
	validateDisplayName,
	validateEmail,
	validatePassword,
	validateTagline,
	validateUsername
}