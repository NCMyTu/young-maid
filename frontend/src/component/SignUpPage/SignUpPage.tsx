import React from "react";
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

const inputFieldInfo: IFormInputProps[] = [
	{ divClassName: "signin-input", inputId: "username", labelText: "Username", inputType: "text", validationRules: usernameValidationRules },
	{ divClassName: "signin-input", inputId: "password", labelText: "Password", inputType: "password", validationRules: passwordValidationRules },
	{ divClassName: "signin-input", inputId: "email", labelText: "Email", inputType: "text", validationRules: emailValidationRules },
	{ divClassName: "signin-input", inputId: "display-name", labelText: "Display Name", inputType: "text", validationRules: displayNameValidationRules },
	{ divClassName: "signin-input", inputId: "tagline", labelText: "Tagline #", inputType: "text", validationRules: taglineValidationRules }
];

const generateFormInputFields = (fieldInfo: IFormInputProps[]) => (
	<>
		{fieldInfo.map(({
			divClassName, inputId, labelText, inputType, validationRules
		}) => (
			<FormInput
				key={inputId}
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
	return (
		<div className="signup-box">
			<h2>Create a new account</h2>
			<form id="signup">
				{generateFormInputFields(inputFieldInfo)}
				<input type="submit" value="Sign Up" />
			</form>
		</div>
	);
}

export default SignUp;