import type { IFormInputProps } from "./FormInput.type.ts";
import FormInput from "./FormInput.tsx";

const generateFormInputFields = (fieldInfo: IFormInputProps[]) => (
	<>
		{fieldInfo.map(({
			divClassName, inputId, labelText, inputType, validationRules, inputRef, warningRef
		}) => (
			<FormInput
				key={inputId}
				inputRef={inputRef}
				warningRef={warningRef}
				divClassName={divClassName}
				inputId={inputId}
				labelText={labelText}
				inputType={inputType}
				validationRules={validationRules}
			/>
		))}
	</>
);

export default generateFormInputFields;