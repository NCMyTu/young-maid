type ValidationRule = {
	validateFunc: (s: string) => boolean,
	message: string
};

interface IFormInputProps {
	divClassName: string,
	labelText: string,
	inputId: string,
	inputType: string,
	inputRef?: React.RefObject<HTMLInputElement | null>,
	validationRules: ValidationRule[]
}

export type {
	IFormInputProps,
	ValidationRule
}