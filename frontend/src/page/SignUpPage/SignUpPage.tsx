import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./SignUpPage.css";
import type { IFormInputProps, ValidationRule } from "@/component/FormInput/FormInput.type";
import {
	displayNameValidationRules,
	emailValidationRules,
	passwordValidationRules,
	tagLineValidationRules,
	usernameValidationRules
} from "./validation-rules";
import generateFormInputFields from "@/component/FormInput/FormInput.helper";
import { validateInput } from "@/component/FormInput/FormInput";
import useUser from "@/lib/store/user/user";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import { ENDPOINTS } from "@/config/endpoints";
import { signIn, type SignInResult } from "@/page/SignInPage/helper";

// TODO:
// HIGH PRIORITY: submit being blocked by tag line warning set from request errors.
// HIGH PRIORITY: Cancel pending requests on resubmit or component unmonnt.
// Add a "repeat password" field.

const setInputAndWarning = (
	input: string,
	validationRules: ValidationRule[],
	setInput: React.Dispatch<React.SetStateAction<string>>,
	setWarning: React.Dispatch<React.SetStateAction<string>>,
): void => {
	setInput(input);
	setWarning(validateInput(input, validationRules));
};

function SignUpPage(): React.JSX.Element {
	const navigate = useNavigate();
	const setUser = useUser((state) => state.setUser);

	const divClassName = "signup-input";

	const [username, setUsername] = useState("");
	const [usernameWarning, setUsernameWarning] = useState("");

	const [password, setPassword] = useState("");
	const [passwordWarning, setPasswordWarning] = useState("");

	const [email, setEmail] = useState("");
	const [emailWarning, setEmailWarning] = useState("");

	const [displayName, setDisplayName] = useState("");
	const [displayNameWarning, setDisplayNameWarning] = useState("");

	const [tagLine, setTagLine] = useState("");
	const [tagLineWarning, setTagLineWarning] = useState("");

	const inputFieldInfo: IFormInputProps[] = [
		{ divClassName: divClassName, inputId: "username", labelText: "Username", inputType: "text", required: true, value: username, warning: usernameWarning, onChange: (value)=>setInputAndWarning(value, usernameValidationRules, setUsername, setUsernameWarning) },
		{ divClassName: divClassName, inputId: "password", labelText: "Password", inputType: "password", required: true, value: password, warning: passwordWarning, onChange: (value) => setInputAndWarning(value, passwordValidationRules, setPassword, setPasswordWarning) },
		{ divClassName: divClassName, inputId: "email", labelText: "Email", inputType: "text", required: true, value: email, warning: emailWarning, onChange: (value) => setInputAndWarning(value, emailValidationRules, setEmail, setEmailWarning) },
		{ divClassName: divClassName, inputId: "display-name", labelText: "Display Name", inputType: "text", required: true, value: displayName, warning: displayNameWarning, onChange: (value) => setInputAndWarning(value, displayNameValidationRules, setDisplayName, setDisplayNameWarning) },
		{ divClassName: divClassName, inputId: "tagline", labelText: "Tag line #", inputType: "text", required: false, value: tagLine, warning: tagLineWarning, onChange: (value) => setInputAndWarning(value, tagLineValidationRules, setTagLine, setTagLineWarning), placeholder: "YM" }
	];

	const submitForm = async () => {
		if (usernameWarning
			|| passwordWarning
			|| emailWarning
			|| displayNameWarning
			|| tagLineWarning
		)
			return;

		const userData = {
			username: username,
			password: password,
			email: email,
			displayName: displayName,
			tagLine: tagLine
		};

		try {
			const res = await fetch(ENDPOINTS.AUTH.signUp, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData)
			});

			if (!res.ok) {
				setTagLineWarning((await res.json()).message)
				return;
			}

			const signInResult: SignInResult = await signIn(username, password);

			if (!signInResult.success)
				setTagLineWarning("TODO: Set different warning based on different status code!")
			else
				setUser(signInResult.user);

			navigate("/");
		} catch (e) {
			setTagLineWarning("Unexpected error. Try again later")
		}
	};

	return (
		<div className="signup-box">
			<h2>Create a new account</h2>
			<form action={submitForm}>
				{generateFormInputFields(inputFieldInfo)}
				<SubmitButton text="Sign Up" />
			</form>

			<p className="signin-text">
				Already have an account?{" "}
				<Link to="/">Sign in</Link>
			</p>
		</div>
	);
}

export default SignUpPage;