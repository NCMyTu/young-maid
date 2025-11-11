import React, { useRef } from "react";
import "./SignInPage.css";
import type { IFormInputProps } from "../FormInput/FormInput.type.ts";
import { Link, useNavigate } from "react-router";
import generateFormInputFields from "../FormInput/FormInput.helper.tsx";

function SignInPage(): React.JSX.Element {
	const navigate = useNavigate();

	const refs = {
		username: useRef<HTMLInputElement>(null),
		password: useRef<HTMLInputElement>(null)
	};
	const warningRef = useRef<HTMLParagraphElement>(null);

	const inputFieldInfo: IFormInputProps[] = [
		{ divClassName: "signin-input", inputId: "username", labelText: "Username", inputType: "text", validationRules: [], inputRef: refs.username },
		{ divClassName: "signin-input", inputId: "password", labelText: "Password", inputType: "password", validationRules: [], inputRef: refs.password, warningRef: warningRef }
	];

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!warningRef.current)
			return;

		const userData = {
			username: refs.username.current?.value,
			password: refs.password.current?.value
		};

		try {
			const res = await fetch("http://localhost:19722/api/users/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData)
			});

			if (!res.ok) {
				if (res.status === 401) { // Peekaboo! Magin number!
					warningRef.current.textContent = "Incorrect username or password";
					warningRef.current.style.visibility = "visible";
				}
				else
					throw new Error();

				return;
			}

			navigate("/");
		} catch {
			warningRef.current.textContent = "Something's wrong. Try again later.";
			warningRef.current.style.visibility = "visible";
		}
	};

	return (
		<div className="signin-box">
			<h2>Sign in</h2>
			<form onSubmit={handleOnSubmit}>
				{generateFormInputFields(inputFieldInfo)}
				<button type="submit">Sign In</button>
			</form>

			<p className="signup-text">
				Don't have an account?{" "}
				<Link to="/signup">Create one</Link>
			</p>
		</div>
	);
}

export default SignInPage;