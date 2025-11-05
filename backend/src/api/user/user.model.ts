import mongoose, { type CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { type IGameId, type IUser } from "./user.type.js";

// TODO:
// test all fields with whitespace and whitespace only
const MONGOOSE_DUPLICATE_KEY_ERR_CODE = 11000;

const USERNAME_MIN_LENGTH = 6;
const PASSWORD_MIN_LENGTH = 6;
const DISPLAY_NAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 35;
const TAGLINE_MIN_LENGTH = 2;
const TAGLINE_MAX_LENGTH = 6;

const GameIdSchema = new mongoose.Schema<IGameId>({
	displayName: {
		type: String,
		required: true,
		trim: true,
		minLength: [DISPLAY_NAME_MIN_LENGTH, `Display name must be at least ${DISPLAY_NAME_MIN_LENGTH} characters long.`],
		maxLength: [DISPLAY_NAME_MAX_LENGTH, `Display name must be less than ${DISPLAY_NAME_MAX_LENGTH} characters.`]
	},
	tagline: {
		type: String,
		default: "YM",
		set: (s: string) => (s.trim() === "" ? "YM" : s),
		trim: true,
		uppercase: true,
		validate: [(s: string) => validator.isAlphanumeric(s, "en-US"), "Tagline must be A-Z, 0-9."],
		minLength: [TAGLINE_MIN_LENGTH, `Tagline must be at least ${TAGLINE_MIN_LENGTH} characters long.`],
		maxLength: [TAGLINE_MAX_LENGTH, `Tagline must be less than ${TAGLINE_MAX_LENGTH} characters.`]
	}},
	{_id: false}
);

const UserSchema = new mongoose.Schema<IUser>({
	username: {
		type: String,
		required: [true, "Username is required."],
		trim: true,
		unique: true,
		minLength: [USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`],
		match: [/^\S+$/, 'Username cannot contain whitespace characters.']
	},
	password: {
		type: String,
		required: [true, "Password is required."],
		minLength: [PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`],
	},
	email: {
		type: String,
		required: [true, "Email is required."],
		trim: true,
		unique: true,
		validate: [validator.isEmail, "Email address is not valid."],
	},
	role: {
		type: String,
		enum: ["user, admin"],
		default: "user",
	},
	gameId: {
		type: GameIdSchema,
		required: true
	}},
	{timestamps: true}
);

UserSchema.index(
	{"gameId.displayName": 1, "gameId.tagline": 1},
	{ unique: true, name: "idx_u_displayName_tagline"}
);

UserSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password"))
		return next();

	try {
		const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 11);
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