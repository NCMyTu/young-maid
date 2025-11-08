import React, { useRef } from "react";
import type { ValidationRule, IFormInputProps } from "./FormInput.type.ts";
import styles from "./FormInput.module.css";

/**
 * Handles input validation for an input field and display a corresponding warning <p>.
 *
 * Stops after the first failed validation, so the order of validation rules matters.
 */
const handleOnInput = (
	e: React.FormEvent<HTMLInputElement>,
	warningRef: React.RefObject<HTMLParagraphElement | null>,
	validationRules: ValidationRule[]
) => {
	const inputValue = e.currentTarget.value;
	const warningElement = warningRef.current;

	if (!warningElement)
		return;

	for (const { validateFunc, message } of validationRules)
		if (!validateFunc(inputValue)) {
			warningElement.style.visibility = "visible";
			warningElement.textContent = message;
			return;
		}

	warningElement.style.visibility = "hidden";
	warningElement.textContent = "JUST F#$@*&^ STOP SHRINKING";
};

function FormInput({
	divClassName,
	labelText,
	inputId,
	inputType,
	inputRef, // This ref is used to get the input value out. I know it's ugly.
	validationRules
}: IFormInputProps): React.JSX.Element {
	const warningRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className={`form-input ${divClassName} ${styles.div}`}>
			<label className={`form-label ${styles.label}`} htmlFor={inputId}>{labelText}</label>
			<input
				ref={inputRef}
				className={`form-input ${styles.input}`}
				type={inputType}
				id={inputId}
				name={inputId}
				onInput={(e) => handleOnInput(e, warningRef, validationRules)}
				required
			/>
			<p className={`form-warning ${styles.warning}`} ref={warningRef}>This is a warning</p>
		</div>
	)
}

export default FormInput;