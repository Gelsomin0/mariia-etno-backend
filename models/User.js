const { Schema, model } = require('mongoose');
const Joi = require('joi');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

const userSchema = Schema({
	username: {
		type: String,
		required: [true, "'Username' is required field"]
	},
	email: {
			type: String,
		required: [true, "'Email' is required field"],
		uniqe: true
	},
	password: {
		type: String,
		required: [true, "'Password' is required field"]
	},
	avatar: {
		url: {
			type: String,
			default: null,
		},
		publicId: {
			type: String,
			default: null,
		}
	},
	gender: {
		type: String,
		enum: ['male', 'female'],
		default: 'male',
	},
	status: {
		type: String,
		enum: ['costumer', 'admin'],
		default: 'costumer',
	},
	verifiedEmail: {
		type: Boolean,
		default: false,
	},
	token: {
		type: String,
		default: null,
	},
}, { versionKey: false, timestamps: true });

const userSignupSchema = Joi.object({
	username: Joi.string().min(3).max(60).required(),
	email: Joi.string().pattern(emailRegex).required(),
	password: Joi.string().pattern(passwordRegex).required(),
});
const userLoginSchema = Joi.object({
	email: Joi.string().pattern(emailRegex).required(),
	password: Joi.string().pattern(passwordRegex).required(),
});

const User = model('user', userSchema);

module.exports = {
	User,
	userSignupSchema,
	userLoginSchema,
}