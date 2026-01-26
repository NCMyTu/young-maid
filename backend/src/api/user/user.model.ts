import mongoose, { type CallbackError, Model } from "mongoose";
import argon2 from "argon2";
import validator from "validator";
import type { DbUser, DbUserMethods } from "./user.type.js";

// TODO:
// test all fields with whitespace and whitespace only

const MONGOOSE_DUPLICATE_KEY_ERR_CODE = 11000;

const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 330;
const PASSWORD_MIN_LENGTH = 6;
const DISPLAY_NAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 35;
const TAGLINE_MIN_LENGTH = 2;
const TAGLINE_MAX_LENGTH = 6;

const userSchema = new mongoose.Schema<DbUser, Model<DbUser>, DbUserMethods>({
	username: {
		type: String,
		required: [true, "Username is required."],
		trim: true,
		unique: true,
		minLength: [USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`],
		maxLength: [USERNAME_MAX_LENGTH, `Username must be less than ${USERNAME_MAX_LENGTH} characters.`],
		match: [/^\S+$/, "Username cannot contain whitespaces."]
	},
	password: {
		type: String,
		required: [true, "Password is required."],
		minLength: [PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`]
	},
	email: {
		type: String,
		required: [true, "Email is required."],
		trim: true,
		unique: true,
		validate: [validator.isEmail, "Email address is not valid."]
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		trim: true,
		default: "user"
	},
	displayName: {
		type: String,
		required: true,
		trim: true,
		minLength: [DISPLAY_NAME_MIN_LENGTH, `Display name must be at least ${DISPLAY_NAME_MIN_LENGTH} characters long.`],
		maxLength: [DISPLAY_NAME_MAX_LENGTH, `Display name must be less than ${DISPLAY_NAME_MAX_LENGTH} characters.`]
	},
	tagLine: {
		type: String,
		default: "YM",
		set: (s: string) => (s.trim() === "" ? "YM" : s),
		trim: true,
		uppercase: true,
		minLength: [TAGLINE_MIN_LENGTH, `Tag line must be at least ${TAGLINE_MIN_LENGTH} characters long.`],
		maxLength: [TAGLINE_MAX_LENGTH, `Tag line must be at most ${TAGLINE_MAX_LENGTH} characters.`],
		validate: [(s: string) => validator.isAlphanumeric(s, "en-US"), "Tag line must be A-Z, 0-9."]
	},
	gold: {
		type: Number,
		default: 0,
	},
	gem: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,

	methods: {
		async comparePassword(against: string): Promise<boolean> {
			return argon2.verify(this.password, against);
		}
	}
});

userSchema.index(
	{ "displayName": 1, "tagLine": 1 },
	{ unique: true, name: "idx_u_gameId" }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password"))
		return next();

	try {
		this.password = await argon2.hash(this.password, {
			type: argon2.argon2id,
			hashLength: Number(process.env.ARGON2_HASH_LENGTH),
			memoryCost: Number(process.env.ARGON2_MEMORY_COST),
			timeCost: Number(process.env.ARGON2_TIME_COST),
			parallelism: Number(process.env.ARGON2_PARALLELISM),
		});
		next();
	} catch (e) {
		next(e as CallbackError);
	}
});

userSchema.post("save", function (error: any, _: any, next: (err?: CallbackError) => void) {
	// TODO: test all error paths.
	if (error && error.name === "MongoServerError" && error.code === MONGOOSE_DUPLICATE_KEY_ERR_CODE) {
		const field = Object.keys(error.keyPattern)[0];
		const defaultMessage = "Duplicate field value.";
		const messages: Record<string, string> = {
			"username": "Username already exists.",
			"email": "Email is already in use.",
			"displayName": "Display name and tag line is already in use.",
			"tagLine": "Display name and tag line is already in use."
		};
		const errorMessage = field ? messages[field] : defaultMessage;
		next(new Error(errorMessage));
	} else {
		next(error);
	}
});

const User = mongoose.model("User", userSchema);

export {
	User
};