import React from "react";
import clsx from "clsx";
import type { ValidationRule, IFormInputProps } from "./FormInput.type";
import styles from "./FormInput.module.css";

/**
 * Stops after the first failed validation, so the order of validation rules matters.
 */
function validateInput(input: string, validationRules: ValidationRule[]): string {
	for (const { validateFunc, message } of validationRules)
		if (!validateFunc(input))
			return message;
	return "";
}

function FormInput({
	divClassName,
	labelText,
	inputId,
	inputType,
	value,
	placeholder,
	onChange,
	warning,
	required,
}: IFormInputProps): React.JSX.Element {
	return (
		<div className={clsx("form-container", styles.container, divClassName)}>
			<label
				className={clsx("form-label", styles.label)}
				htmlFor={inputId}
			>
				{labelText}
			</label>

			<input
				className={clsx("form-input", styles.input)}
				type={inputType}
				id={inputId}
				name={inputId}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={required}
				placeholder={placeholder}
			/>

			<p
				className={clsx("form-warning", styles.warning)}
				id={`${inputId}-warning`}
				aria-live="polite"
				style={{ visibility: warning ? "visible" : "hidden" }}
			>
				{warning || "This is a warning"}
			</p>
		</div>
	);
}

export default FormInput;
export { validateInput };