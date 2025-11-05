import validator from "validator";

// Ugly but it works (for now).
type IValidationFunc = (
	value: string,
	valueType: string,
	minLength?: number,
	maxLength?: number,
	regex?: RegExp,
) => IValidationFuncResult;

interface IValidationFuncResult {
	ok: boolean,
	message: string
}

const toggleElement = (element: HTMLElement, onOff: string, message?: string): void => {
	if (onOff === "on") {
		element.style.display = "block";
		element.textContent = message ? message : "";
	}
	else if (onOff === "off")
		element.style.display = "none";
};

const checkLength = (value: string, valueType: string, minLength?: number, maxLength?: number): IValidationFuncResult => {
	if (minLength && value.length < minLength) 
		return { ok: false, message: `${valueType} must be at least ${minLength} characters long` };
	if (maxLength && value.length > maxLength) 
		return { ok: false, message: `${valueType} must be less than ${maxLength} characters` };
	return { ok: true, message: "" };
};

const cannotContain = (value: string, valueType: string, regex: RegExp): IValidationFuncResult => {
	if (!regex.test(value))
		return { ok: true, message: "" };
	return { ok: false, message: `${valueType} cannot contain ${regex.toString()}` };
};

const cannotContainSpace = (value: string, valueType: string): IValidationFuncResult => {
	return { ...cannotContain(value, valueType, /\s/), message: `${valueType} cannot contain whitespace characters` };
};

const isEmail = (value: string, valueType: string): IValidationFuncResult => {
	return { ok: validator.isEmail(value), message: `${valueType} is not a proper email` };
};

const isAlphanumeric = (value: string, valueType: string): IValidationFuncResult => {
	return { ok: validator.isAlphanumeric(value, "en-US"), message: `${valueType} must be A-Z, 0-9` };
};

const validateInput = (value: string, valueType: string, validationFunctions: IValidationFunc[]): IValidationFuncResult => {
	// Return retulst of the first validation function that fails.
	for (const validate of validationFunctions) {
		const result = validate(value, valueType);
		if (!result.ok)
			return result;
	}
	return { ok: true, message: "" };
};

export {
	toggleElement,
	checkLength,
	cannotContain,
	cannotContainSpace,
	isEmail,
	isAlphanumeric,
	validateInput,
	type IValidationFuncResult
};