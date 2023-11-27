const ctrlWrapper = require('../decorators/ctrlWrapper');
const HttpError = require('../helpers/HttpError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user) {
			throw HttpError(409, 'Email is already in use');
	}

	const hashPassword = await bcrypt.hash(password, 10);

	await User.create({
			...req.body,
			password: hashPassword,
	});

	res.status(201).json({ message: 'user account has been registered with success' });
}

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}

	const comparedPassword = bcrypt.compare(password, user.password);

	if (!comparedPassword) {
		throw HttpError(401, 'Email or password is wrong');
	}

	const payload = { id: user._id };
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		user: {
			username: user.username,
			email,
			avatarUrl: user.avatar.url,
			gender: user.gender,
			status: user.status,
			verifiedEmail: user.VerifiedEmail,
		},
		token,
	});
}

module.exports = {
	signup: ctrlWrapper(signup),
	login: ctrlWrapper(login),
}