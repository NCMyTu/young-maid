import type { FormInputProps } from "./FormInput.type";
import FormInput from "./FormInput";

const generateFormInputFields = (fieldInfo: FormInputProps[]) => (
	<>
		{fieldInfo.map(({
			divClassName,
			labelText,
			inputId,
			inputType,
			value,
			placeholder,
			onChange,
			warning,
			required
		}) => (
			<FormInput
				key={inputId}
				divClassName={divClassName}
				labelText={labelText}
				inputId={inputId}
				inputType={inputType}
				value={value}
				onChange={onChange}
				warning={warning}
				required={required}
				placeholder={placeholder}
			/>
		))}
	</>
);

export default generateFormInputFields;