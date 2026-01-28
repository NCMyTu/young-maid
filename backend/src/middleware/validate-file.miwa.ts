import type { RequestHandler } from "express";
import { fileTypeFromFile } from "file-type";
import path from "path";
import { rename } from "fs/promises";
import { deleteFile } from "@/util/util.js";
import { MissingFileError, UnsupportedFileTypeError } from "@/util/error.js";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/bmp",
	"image/webp"
];

const validateFile: RequestHandler = async (req, _, next) => {
	// Perform actual validation on the uploaded/downloaded file.
	let currentPath: string | undefined = req.file?.path;

	if (!req.file || !currentPath)
		throw new MissingFileError();

	try {
		const fileType: { ext: string, mime: string } | undefined = await fileTypeFromFile(req.file.path);

		if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime))
			throw new UnsupportedFileTypeError(fileType?.ext);

		const ext = fileType.ext === "jpeg" ? "jpg" : fileType.ext;

		const oldPath = currentPath;
		const dir = path.dirname(oldPath).replaceAll("\\", "/");
		const baseName = path.basename(oldPath, path.extname(oldPath));
		const newName = `${baseName}.${ext}`;
		const newPath = path.join(dir, newName);

		if (oldPath !== newPath) {
			await rename(oldPath, newPath);
			currentPath = newPath;

			req.file.destination = dir;
			req.file.path = newPath;
			req.file.filename = newName;
			req.file.mimetype = fileType.mime;
		}

		next();
	} catch (e) {
		await deleteFile(currentPath);
		throw e;
	}
};

export { validateFile };