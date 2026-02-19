import React from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import type { SubmitButtonProps } from "./SubmitButton.type";

function SubmitButton({ text, id, className, onClick }: SubmitButtonProps): React.JSX.Element {
	// useFormStatus only works here instead of in a bigger function.
	// weid...
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			id={id}
			className={clsx(className)}
			onClick={onClick}
			disabled={pending}
		>
			{text}
		</button>
	);
}

export default SubmitButton;