import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import * as CustomError from "@/util/error.js";

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
	console.log(err);

	// TODO:
	// res 2xx have dot while error message doesn't. Pick one.
	// Check for correct status code.
	if (err instanceof CustomError.InvalidOrMissingAuthToken)
		res.status(401).json({ message: err.message });
	else if (err instanceof CustomError.SigninError)
		res.status(401).json({ message: err.message });
	else if (err instanceof CustomError.InvalidItemTypeError)
		res.status(400).json({ message: err.message });
	else if (err instanceof CustomError.MissingFileError)
		res.status(415).json({ message: err.message });
	else if (err instanceof CustomError.UnsupportedFileTypeError)
		res.status(415).json({ message: err.message });
	else if (err instanceof mongoose.Error.ValidationError ||
		err instanceof mongoose.Error.CastError ||
		err instanceof mongoose.Error
	)
		res.status(400).json({ message: "Invalid input data" });
	else
		res.status(500).json({ message: "Unexpected error" });
}

export { errorHandler };