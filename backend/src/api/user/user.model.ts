import mongoose, { type CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { type IGameId, type IUser } from "./user.type.js";

// TODO:
// test all fields with whitespace and whitespace only
const MONGOOSE_DUPLICATE_KEY_ERR_CODE = 11000;

const GameIdSchema = new mongoose.Schema<IGameId>({
	displayName: {
		type: String,
		required: true,
		trim: true,
		minLength: [3, "Display name must be at least 3 characters long."],
		maxLength: [35, "Display name must be less than 35 characters"]
	},
	tagline: {
		type: String,
		default: "YM",
		set: (s: string) => (s.trim() === "" ? "YM" : s),
		trim: true,
		uppercase: true,
		validate: [(s: string) => validator.isAlphanumeric(s, "en-US"), "Tagline must be A-Z, 0-9."],
		maxLength: [6, "Tagline must be less than 6 characters."]
	}},
	{_id: false}
);

const UserSchema = new mongoose.Schema<IUser>({
	username: {
		type: String,
		required: [true, "Username is required."],
		trim: true,
		unique: true,
		minLength: [6, "Username must be at least 6 characters long."],
		match: [/^\S+$/, 'Username cannot contain spaces.']
	},
	password: {
		type: String,
		required: [true, "Password is required."],
		minLength: [8, "Password must be at least 8 characters long."],
	},
	email: {
		type: String,
		required: [true, "Email is required."],
		trim: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Email address is not valid."],
	},
	gameId: {
		type: GameIdSchema,
		required: true
	}},
	{timestamps: true}
);

UserSchema.index(
	{"gameId.displayName": 1, "gameId.tagline": 1},
	{unique: true}
);

UserSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password"))
		return next();

	try {
		const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND) || 11);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (e) {
		next(e as CallbackError);
	}
});

UserSchema.post("save", function (error: any, _: any, next: (err?: CallbackError) => void) {
	if (error && error.name === "MongoServerError" && error.code === MONGOOSE_DUPLICATE_KEY_ERR_CODE) {
		const field = Object.keys(error.keyPattern)[0];
		const defaultMessage = "Duplicate field value.";
		const messages: Record<string, string> = {
			"username": "Username already exists.",
			"email": "Email is already in use.",
			"gameId.displayName": "Display name and tagline is already in use.",
			"gameId.tagline": "Display name and tagline is already in use."
		};
		const errorMessage = field ? messages[field] : defaultMessage;
		next(new Error(errorMessage));
	} else {
		next(error);
	}
});

UserSchema.methods.comparePassword = async function (passwordToTest: string): Promise<boolean> {
	return bcrypt.compare(passwordToTest, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;