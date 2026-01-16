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
			const res = await fetch("http://localhost:19722/api/users/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData)
			}) as any;

			const result = await res.json();
			console.log(result.message);

			if (!res.ok) {
				setTagLineWarning(result.message)
				return;
			}

			// Sign in.
			// TODO: extract this with the one in SignInPage into common function.
			let resSignIn = await fetch("http://localhost:19722/api/users/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ username, password })
			}) as any; // ughh...

			if (!resSignIn.ok) {
				if (resSignIn.status === 401) // Peekaboo! Magin number! Again!
					setTagLineWarning("TODO: Set different warning based on different status code!")
				else
					throw new Error();
			}
			resSignIn = await resSignIn.json();

			const { id, displayName, tagLine, role } = resSignIn;
			setUser({ id, displayName, tagLine, role });
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