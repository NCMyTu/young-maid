import validator from "validator";

const checkLength = (s: string, minLength: number, maxLength?: number): boolean => {
	if (s.length < minLength)
		return false;
	if (maxLength !== undefined && s.length > maxLength)
		return false;
	return true;
};

const cannotContain = (s: string, regex: RegExp): boolean => !regex.test(s);

const cannotContainSpace = (s: string): boolean => cannotContain(s, /\s/);

// These 2 are just wrappers but this keeps them consistent with the other functions.
const isEmail = (s: string): boolean => validator.isEmail(s);

const isAlphanumeric = (s: string): boolean => validator.isAlphanumeric(s, "en-US");

export {
	cannotContain,
	cannotContainSpace,
	checkLength,
	isAlphanumeric,
	isEmail
};