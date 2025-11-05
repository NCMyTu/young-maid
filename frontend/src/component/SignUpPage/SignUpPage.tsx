import React, { useRef } from "react";
import "./SignUpPage.css";
import FormInput from "../FormInput/FormInput.tsx";
import type { IFormInputProps } from "../FormInput/FormInput.type.ts";
import {
	displayNameValidationRules,
	emailValidationRules,
	passwordValidationRules,
	taglineValidationRules,
	usernameValidationRules
} from "./validation-rule.ts";

// TODO:
// maybe implement a bloom filter.
// add a "repeat password" field

const generateFormInputFields = (fieldInfo: IFormInputProps[]) => (
	<>
		{fieldInfo.map(({
			divClassName, inputId, labelText, inputType, validationRules, inputRef
		}) => (
			<FormInput
				key={inputId}
				inputRef={inputRef}
				divClassName={divClassName}
				inputId={inputId}
				labelText={labelText}
				inputType={inputType}
				validationRules={validationRules}
			/>
		))}
	</>
);



function SignUp(): React.JSX.Element {
	const refs = {
		username: useRef<HTMLInputElement>(null),
		password: useRef<HTMLInputElement>(null),
		email: useRef<HTMLInputElement>(null),
		displayName: useRef<HTMLInputElement>(null),
		tagline: useRef<HTMLInputElement>(null),
	};

	// Change this if you want to add another input field.
	const inputFieldInfo: IFormInputProps[] = [
		{ divClassName: "signin-input", inputId: "username", labelText: "Username", inputType: "text", validationRules: usernameValidationRules, inputRef: refs.username },
		{ divClassName: "signin-input", inputId: "password", labelText: "Password", inputType: "password", validationRules: passwordValidationRules, inputRef: refs.password },
		{ divClassName: "signin-input", inputId: "email", labelText: "Email", inputType: "text", validationRules: emailValidationRules, inputRef: refs.email },
		{ divClassName: "signin-input", inputId: "display-name", labelText: "Display Name", inputType: "text", validationRules: displayNameValidationRules, inputRef: refs.displayName },
		{ divClassName: "signin-input", inputId: "tagline", labelText: "Tagline #", inputType: "text", validationRules: taglineValidationRules, inputRef: refs.tagline }
	];

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log({
			username: refs.username.current?.value,
			password: refs.password.current?.value,
			email: refs.email.current?.value,
			displayName: refs.displayName.current?.value,
			tagline: refs.tagline.current?.value,
		});
	};

	return (
		<div className="signup-box">
			<h2>Create a new account</h2>
			<form id="signup" onSubmit={handleOnSubmit}>
				{generateFormInputFields(inputFieldInfo)}
				<input type="submit" value="Sign Up" />
			</form>
		</div>
	);
}

export default SignUp;