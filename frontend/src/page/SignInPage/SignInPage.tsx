import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./SignInPage.css";
import type { FormInputProps } from "@/component/FormInput/FormInput.type";
import generateFormInputFields from "@/component/FormInput/FormInput.helper";
import useUser from "@/lib/store/user/user";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import { signIn, type SignInResult } from "./helper";

function SignInPage(): React.JSX.Element {
	const navigate = useNavigate();
	const setUser = useUser((state) => state.setUser);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [warning, setWarning] = useState("");

	const inputFieldInfo: FormInputProps[] = [
		{
			divClassName: "signin-input",
			inputId: "username",
			labelText: "Username",
			inputType: "text",
			required: true,
			value: username,
			onChange: (value: string) => {
				setUsername(value);
			}
		},
		{
			divClassName: "signin-input",
			inputId: "password",
			labelText: "Password",
			inputType: "password",
			required: true,
			value: password,
			warning: warning,
			onChange: (value: string) => {
				setPassword(value)
			}
		}
	];

	const submitForm = async () => {
		try {
			const signInResult: SignInResult = await signIn(username, password);

			if (!signInResult.success)
				setWarning(signInResult.message);
			else
				setUser(signInResult.user);

			navigate("/");
		} catch {
			// TODO: warning in a <p> above the button instead of this.
			setWarning("Unexpected error. Try again later")
		}
	};

	return (
		<div className="signin-box">
			<h2>Sign in</h2>
			<form action={submitForm}>
				{generateFormInputFields(inputFieldInfo)}
				<SubmitButton text="Sign In" />
			</form>

			<p className="signup-text">
				Don't have an account?{" "}
				<Link to="/signup">Create one</Link>
			</p>
		</div>
	);
}

export default SignInPage;