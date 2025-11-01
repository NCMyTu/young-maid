function getMissingFields(fields, returnAsString = false) {
	const missing = [];

	Object.entries(fields).forEach(([key, value]) => {
		if (!value || (typeof value === "string" && !value.trim())) 
			missing.push(key);
	});

	if (!returnAsString)
		return missing;

	if (missing.length === 0)
		return "";
	if (missing.length === 1)
		return missing[0];
	if (missing.length === 2)
		return `${missing[0]} and ${missing[1]}`;
	return `${missing.slice(0, -1).join(", ")}, and ${missing.at(-1)}`;
}

export {
	getMissingFields
}