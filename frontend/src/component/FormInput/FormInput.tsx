import type { IValidationFuncResult } from "../SigninPage/helper.tsx";
import React from "react";
import { toggleElement } from "../SigninPage/helper.tsx";

interface IFormInputProps {
	divClassName: string,
	labelText: string,
	inputId: string,
	inputType: string,
	warningStyle: string | undefined,
	inputRef: React.RefObject<HTMLInputElement | null>,
	warningRef: React.RefObject<HTMLParagraphElement | null>,
	validationStrategy: (input: string) => IValidationFuncResult
}

function FormInput({
	divClassName,
	labelText,
	inputId,
	inputType,
	warningStyle,
	inputRef,
	warningRef,
	validationStrategy
}: IFormInputProps): React.JSX.Element {
	return (
		<div className={divClassName}>
			<label id={`label-${inputId}`} htmlFor={inputId}>{labelText}</label>
			<input
				type={inputType}
				id={inputId}
				name={inputId}
				ref={inputRef}
				onInput={(
					e: React.FormEvent<HTMLInputElement>
				): void => {
					const inputValue = e.currentTarget.value;
					const result = validationStrategy(inputValue);

					if (!warningRef.current) return;

					if (result.ok)
						toggleElement(warningRef.current, "off");
					else
						toggleElement(warningRef.current, "on", result.message);
				}}
			/>
			<p ref={warningRef} className={warningStyle}></p>
		</div>
	)
}

export default FormInput;