import type { Request } from "express";
import multer from "multer";
import mime from "mime";

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
	destination: "uploads",

	filename: (
		_: Request,
		file: Express.Multer.File,
		callback: (error: Error | null, filename: string) => void
	) => {
		const suffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
		const ext: string | null = mime.getExtension(file.mimetype);
		const fileName = `${file.fieldname}_${suffix}.${ext}`;
		callback(null, fileName);
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