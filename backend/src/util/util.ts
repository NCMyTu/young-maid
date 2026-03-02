import { unlink } from "fs/promises";

const capitalize = (s: string): string =>
	s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

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

const deleteFile = async (path?: string) => {
	if (!path)
		return;
	try {
		await unlink(path);
	} catch (e) {
		console.error(`Error when deleting file: ${e}`)
	}
};

const sleepForMs = (ms: number): Promise<unknown> => {
	return new Promise(_ => setTimeout(_, ms));
};

export {
	capitalize,
	deleteFile,
	getMissingFields,
	sleepForMs
};