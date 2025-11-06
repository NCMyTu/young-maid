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
} from "./ValidationRules.ts";

// TODO:
// maybe implement a bloom filter.
// add a "repeat password" field
// check for warning before submitting

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
		{ divClassName: "signup-input", inputId: "username", labelText: "Username", inputType: "text", validationRules: usernameValidationRules, inputRef: refs.username },
		{ divClassName: "signup-input", inputId: "password", labelText: "Password", inputType: "password", validationRules: passwordValidationRules, inputRef: refs.password },
		{ divClassName: "signup-input", inputId: "email", labelText: "Email", inputType: "text", validationRules: emailValidationRules, inputRef: refs.email },
		{ divClassName: "signup-input", inputId: "display-name", labelText: "Display Name", inputType: "text", validationRules: displayNameValidationRules, inputRef: refs.displayName },
		{ divClassName: "signup-input", inputId: "tagline", labelText: "Tagline #", inputType: "text", validationRules: taglineValidationRules, inputRef: refs.tagline }
	];

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const userData = {
			username: refs.username.current?.value,
			password: refs.password.current?.value,
			email: refs.email.current?.value,
			displayName: refs.displayName.current?.value,
			tagline: refs.tagline.current?.value,
		};

		try {
			const res = await fetch("http://localhost:19722/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const result = await res.json();

			if (!res.ok) {
				// TODO: add a warn <p> right before the submit button.
				alert(`Error: ${res.status} ${result.message}`);
				return;
			}

			alert(`User created: ${JSON.stringify(result.user)}`);
		} catch (e) {
			alert(`Request failed: ${e}`);
		}
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