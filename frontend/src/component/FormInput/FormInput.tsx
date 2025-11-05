import React, { useRef } from "react";
import type { ValidationRule, IFormInputProps } from "./FormInput.type.ts";

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
			warningElement.style.display = "block";
			warningElement.textContent = message;
			// warningElement.classList.remove("hidden");
			return;
		}

	warningElement.style.display = "none";
	warningElement.textContent = "";
	// warningElement.classList.add("hidden");
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
		<div className={divClassName}>
			<label className="form-label" id={`label-${inputId}`} htmlFor={inputId}>{labelText}</label>
			<input
				ref={inputRef}
				className="form-input"
				type={inputType}
				id={inputId}
				name={inputId}
				onInput={(e) => handleOnInput(e, warningRef, validationRules)}
			/>
			<p className={`form-warning`} ref={warningRef}></p>
		</div>
	)
}

export default FormInput;