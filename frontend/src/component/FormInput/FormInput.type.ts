interface IFormInputProps {
	divClassName?: string;
	labelText: string;
	inputId: string;
	inputType: React.HTMLInputTypeAttribute;
	required: boolean;
	placeholder?: string;

	value: string;
	onChange: (value: string) => void;
	warning?: string
}

type ValidationRule = {
	validateFunc: (s: string) => boolean;
	message: string
};

export type {
	IFormInputProps,
	ValidationRule
}