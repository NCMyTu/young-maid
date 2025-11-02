function getMissingFields(fields: Record<string, string>, returnAsString: true): string;
function getMissingFields(fields: Record<string, string>, returnAsString?: false): string[];
function getMissingFields(fields: Record<string, string>, returnAsString: boolean = false) {
	const missing: string[] = [];

	for (const [key, value] of Object.entries(fields)) {
		if (!value.trim())
			missing.push(key);
	}

	if (!returnAsString)
		return missing;
	
	return missing.join(", ");
}

export {
	getMissingFields
}