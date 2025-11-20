interface IFormInputProps {
	divClassName: string,
	labelText: string,
	inputId: string,
	inputType: string,
	inputRef?: React.RefObject<HTMLInputElement | null>,
	warningRef?: React.RefObject<HTMLParagraphElement | null>,
	validationRules: ValidationRule[]
}

type ValidationRule = {
	validateFunc: (s: string) => boolean,
	message: string
};

export type {
	IFormInputProps,
	ValidationRule
}