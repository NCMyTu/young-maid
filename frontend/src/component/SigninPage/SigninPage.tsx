import { useRef } from "react";
import styles from "./SigninPage.module.css";
import { validateDisplayName, validateEmail, validateTagline, validateUsername, validatePassword } from "./validation-strategy.tsx";
import { type IValidationFuncResult } from "./helper.tsx";
import FormInput from "../FormInput/FormInput";
import React from "react";
import "./SigninPage.css";

// TODO:
// maybe implement a bloom filter.

interface IInputRefs {
	username: React.RefObject<HTMLInputElement | null>;
	email: React.RefObject<HTMLInputElement | null>;
	password: React.RefObject<HTMLInputElement | null>;
	displayName: React.RefObject<HTMLInputElement | null>;
	tagline: React.RefObject<HTMLInputElement | null>;
}

interface IWarningRefs {
	username: React.RefObject<HTMLParagraphElement | null>;
	password: React.RefObject<HTMLParagraphElement | null>;
	email: React.RefObject<HTMLParagraphElement | null>;
	displayName: React.RefObject<HTMLParagraphElement | null>;
	tagline: React.RefObject<HTMLParagraphElement | null>;
}

interface IInput {
	inputId: keyof IInputRefs,
	labelText: string,
	inputType: string,
	validationStrat: (input: string) => IValidationFuncResult
}

const generateFormInputFields = (
	inputRefs: IInputRefs, warningRefs: IWarningRefs, inputFields: IInput[]
): React.JSX.Element[] => {
	return inputFields.map((
		{ inputId, labelText, inputType, validationStrat }
	) => (
		<FormInput
			key={inputId}
			divClassName="signin-input"
			labelText={labelText}
			inputId={inputId}
			inputType={inputType}
			warningStyle={styles.warning}
			inputRef={inputRefs[inputId]}
			warningRef={warningRefs[inputId]}
			validationStrategy={validationStrat}
		/>
	))
};

function SignUp() {
	const inputRefs: IInputRefs = {
		username: useRef(null),
		email: useRef(null),
		password: useRef(null),
		displayName: useRef(null),
		tagline: useRef(null),
	}

	const warningRefs: IWarningRefs = {
		username: useRef(null),
		password: useRef(null),
		email: useRef(null),
		displayName: useRef(null),
		tagline: useRef(null),
	};

	const inputFields: IInput[] = [
		{ inputId: "username", labelText: "Username", inputType: "text", validationStrat: validateUsername },
		{ inputId: "password", labelText: "Password", inputType: "password", validationStrat: validatePassword },
		{ inputId: "email", labelText: "Email", inputType: "text", validationStrat: validateEmail },
		{ inputId: "displayName", labelText: "Display Name", inputType: "text", validationStrat: validateDisplayName },
		{ inputId: "tagline", labelText: "Tagline #", inputType: "text", validationStrat: validateTagline },
	];

	return (
		<div className="signup-box">
			<h2>Create a new account</h2>
			<form id="signin">
				{generateFormInputFields(inputRefs, warningRefs, inputFields)}
				<input type="submit" value="Sign Up" />
			</form>
		</div>
	);
}

export default SignUp;