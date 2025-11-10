import React, { useRef } from "react";
import "./SignInPage.css";
import FormInput from "../FormInput/FormInput.tsx";
import type { IFormInputProps } from "../FormInput/FormInput.type.ts";

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

function SignIn(): React.JSX.Element {
	const refs = {
		username: useRef<HTMLInputElement>(null),
		password: useRef<HTMLInputElement>(null)
	};

	const inputFieldInfo: IFormInputProps[] = [
		{ divClassName: "signin-input", inputId: "username", labelText: "Username", inputType: "text", validationRules: [], inputRef: refs.username },
		{ divClassName: "signin-input", inputId: "password", labelText: "Password", inputType: "password", validationRules: [], inputRef: refs.password }
	];

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const userData = {
			username: refs.username.current?.value,
			password: refs.password.current?.value
		};

		try {
			const res = await fetch("http://localhost:19722/api/users/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData)
			});

			const result = await res.json();

			if (!res.ok) {
				// TODO: add a warn <p> right before the submit button.
				alert(`Error: ${res.status} ${result.message}`);
				return;
			}

			alert(`Signed in`);
		} catch (e) {
			alert(`Request failed: ${e}`);
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
				<a href="/signup">Create one</a>
			</p>
		</div>
	);
}

export default SignIn;