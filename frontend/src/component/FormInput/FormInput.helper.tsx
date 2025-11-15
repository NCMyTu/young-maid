import type { IFormInputProps } from "./FormInput.type";
import FormInput from "./FormInput";

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