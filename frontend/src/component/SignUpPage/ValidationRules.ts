import { cannotContainSpace, checkLength, isEmail, isAlphanumeric } from "./helper.ts";
import { type ValidationRule } from "../FormInput/FormInput.type.ts";

const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 330;
const PASSWORD_MIN_LENGTH = 6;
const DISPLAY_NAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 35;
const TAGLINE_MIN_LENGTH = 2;
const TAGLINE_MAX_LENGTH = 6;

const usernameValidationRules: ValidationRule[] = [
	{
		validateFunc: cannotContainSpace,
		message: "Username cannot contain spaces",
	},
	{
		validateFunc: (s: string) => checkLength(s, USERNAME_MIN_LENGTH),
		message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
	},
	{
		validateFunc: (s: string) => checkLength(s, 0, USERNAME_MAX_LENGTH),
		message: `Username must be less than ${USERNAME_MAX_LENGTH} characters`,
	}
];

const passwordValidationRules: ValidationRule[] = [
	{
		validateFunc: (s: string) => checkLength(s, PASSWORD_MIN_LENGTH),
		message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
	}
];

const emailValidationRules: ValidationRule[] = [
	{
		validateFunc: isEmail,
		message: `Email format is incorrect`,
	}
];

const displayNameValidationRules: ValidationRule[] = [
	{
		validateFunc: (s: string) => checkLength(s, DISPLAY_NAME_MIN_LENGTH, DISPLAY_NAME_MAX_LENGTH),
		message: `Display name must be between ${DISPLAY_NAME_MIN_LENGTH}-${DISPLAY_NAME_MAX_LENGTH} characters long`,
	}
];

const taglineValidationRules: ValidationRule[] = [
	{
		validateFunc: isAlphanumeric,
		message: `Tagline must be A-Z, 0-9`,
	},
	{
		validateFunc: (s: string) => checkLength(s, TAGLINE_MIN_LENGTH, TAGLINE_MAX_LENGTH),
		message: `Tagline must be between ${TAGLINE_MIN_LENGTH}-${TAGLINE_MAX_LENGTH} characters long`,
	}
];

export {
	usernameValidationRules,
	passwordValidationRules,
	emailValidationRules,
	displayNameValidationRules,
	taglineValidationRules,
}