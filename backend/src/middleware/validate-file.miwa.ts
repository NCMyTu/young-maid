import type { Request, Response, NextFunction } from "express";
import { fileTypeFromFile } from "file-type";
import path from "path";
import { rename, unlink } from "fs/promises";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/bmp",
	"image/webp"
];

const message = "File rejected."

const cleanUp = async (path?: string) => {
	if (!path)
		return;
	try {
		await unlink(path);
	} catch (e) {
		console.error(`Error when deleting file: ${e}`)
	}
};

const validateFile = async (req: Request, res: Response, next: NextFunction) => {
	// Perform actual validation on the uploaded/downloaded file.
	let currentPath: string | undefined = req.file?.path;

	if (!req.file || !req.file.path)
		return res.status(401).json({ message });

	try {
		const fileType: { ext: string, mime: string } | undefined = await fileTypeFromFile(req.file.path);

		if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime))
			throw new Error("Unsupported file type");

		const ext = fileType.ext === "jpeg" ? "jpg" : fileType.ext;

		const oldPath = req.file.path.replaceAll("\\", "/");
		const dir = path.dirname(oldPath).replaceAll("\\", "/");
		const baseName = path.basename(oldPath, path.extname(oldPath));
		const newName = `${baseName}.${ext}`;
		const newPath = path.join(dir, newName).replaceAll("\\", "/");

		if (oldPath === newPath)
			return next();

		await rename(oldPath, newPath);
		currentPath = newPath;

		req.file.destination = dir;
		req.file.path = newPath;
		req.file.filename = newName;
		req.file.mimetype = fileType.mime;

		next();
	} catch {
		await cleanUp(currentPath);
		return res.status(415).json({ message });
	}
};

export { validateFile };