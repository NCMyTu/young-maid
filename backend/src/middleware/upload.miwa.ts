import type { Request } from "express";
import multer from "multer";
import fs from "fs";
import { v7 as uuid_v7 } from "uuid";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/bmp",
	"image/webp"
];

const fileFilter = (
	_: Request,
	file: Express.Multer.File,
	callback: multer.FileFilterCallback
): void => {
	// Just a quick check.
	// Not a security guarantee since the MIME type is provided by client.
	// The file is fully validated later.
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
		return callback(null, false);
	callback(null, true);
};

const limits = {
	fileSize: 8 * 1024 * 1024,
	files: 1
};

const storage: multer.StorageEngine = multer.diskStorage({
	destination: (
		_: Request,
		file: Express.Multer.File,
		callback: (error: Error | null, destination: string) => void) => {
		let path = "upload/";

		if (file.fieldname === "item-icon")
			path = path.concat("item");
		else if (file.fieldname === "avatar")
			path = path.concat("avatar");
		else
			// TODO: create an error type.
			return callback(new Error("Invalid file upload fieldname"), "");

		try {
			fs.mkdirSync(path, { recursive: true });
			callback(null, path);
		} catch (e) {
			callback(e as Error, "");
		}
	},

	filename: (
		_: Request,
		__: Express.Multer.File,
		callback: (error: Error | null, filename: string) => void
	) => {
		// There will be a middleware to fully validate and rename the file.
		callback(null, uuid_v7());
	}
});

const uploadSingleFile = (
	fieldName: string
) => multer({
	storage,
	fileFilter,
	limits
}).single(fieldName);

export { uploadSingleFile };