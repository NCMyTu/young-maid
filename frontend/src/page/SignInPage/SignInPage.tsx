import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./SignInPage.css";
import clsx from "clsx";
import type { IFormInputProps } from "@/component/FormInput/FormInput.type";
import generateFormInputFields from "@/component/FormInput/FormInput.helper";
import useUser from "@/lib/store/user/user";

interface UserResponse extends Response {
	id: string,
	displayName: string,
	tagLine: string,
	role: string
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
			let res = await fetch("http://localhost:19722/api/users/auth/signin", {
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

			const { id, displayName, tagLine, role } = res;
			setUser({ id, displayName, tagLine, role });

			navigate("/");
		} catch {
			// TODO: warning in a <p> above the button instead of this.
			setWarning("Unexpected error. Try again later")
		}
	};

	return (
		<div className={clsx("signin-box")}>
			<h2>Sign in</h2>
			<form action={submitForm}>
				{generateFormInputFields(inputFieldInfo)}
				<button type="submit">Sign In</button>
			</form>

			<p className={clsx("signup-text")}>
				Don't have an account?{" "}
				<Link to="/signup">Create one</Link>
			</p>
		</div>
	);
}

export default SignInPage;