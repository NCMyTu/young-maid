import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./SignInPage.css";
import type { IFormInputProps } from "@/component/FormInput/FormInput.type";
import generateFormInputFields from "@/component/FormInput/FormInput.helper";
import useUser from "@/lib/store/user/user";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import { ENDPOINTS } from "@/config/endpoints";

interface UserResponse extends Response {
	id: string,
	displayName: string,
	tagLine: string,
	role: string,
	gold: number,
	gem: number
};

function SignInPage(): React.JSX.Element {
	const navigate = useNavigate();
	const setUser = useUser((state) => state.setUser);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [warning, setWarning] = useState("");

	const inputFieldInfo: IFormInputProps[] = [
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
			// TODO: no need to set header and body, form action will handle it.
			let res = await fetch(ENDPOINTS.AUTH.signIn, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ username, password })
			}) as UserResponse;

			if (!res.ok) {
				if (res.status === 401) // Peekaboo! Magin number!
					setWarning("Incorrect username or password")
				else
					throw new Error();
			}

			res = await res.json();

			const { id, displayName, tagLine, role, gold, gem } = res;
			setUser({ id, displayName, tagLine, role, gold, gem });

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