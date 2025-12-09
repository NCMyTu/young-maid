import React, { useRef } from "react";
import { Link, useNavigate } from "react-router";
import "./SignInPage.css";
import clsx from "clsx";
import type { IFormInputProps } from "@/component/FormInput/FormInput.type";
import generateFormInputFields from "@/component/FormInput/FormInput.helper";
import useUser from "@/lib/store/user/user";
import { useShallow } from "zustand/shallow";

interface UserResponse extends Response {
	id: string,
	displayName: string,
	tagline: string,
	role: string
};

function SignInPage(): React.JSX.Element {
	const navigate = useNavigate();
	const setUser = useUser((state) => state.set);

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
			let res = await fetch("http://localhost:19722/api/users/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData)
			}) as UserResponse;

			if (!res.ok) {
				if (res.status === 401) { // Peekaboo! Magin number!
					warningRef.current.textContent = "Incorrect username or password";
					warningRef.current.style.visibility = "visible";
				}
				else
					throw new Error();

				return;
			}

			res = await res.json();

			const { id, displayName, tagline, role } = res;
			setUser({ id, displayName, tagline, role });

			navigate("/");
		} catch {
			warningRef.current.textContent = "Something's wrong. Try again later.";
			warningRef.current.style.visibility = "visible";
		}
	};

	return (
		<div className={clsx("signin-box")}>
			<h2>Sign in</h2>
			<form onSubmit={handleOnSubmit}>
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