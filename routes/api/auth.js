const express = require('express');
const { signup, login } = require('../../controllers/authControllers');
const validateBody = require('../../decorators/validateBody');
const { userSignupSchema, userLoginSchema } = require('../../models/User');
const isEmptyBody = require('../../middlewares/isEmptyBody');

const signupSchemaValidate = validateBody(userSignupSchema);
const loginSchemaValidate = validateBody(userLoginSchema);

const authRouter = express.Router();

authRouter.post('/signup', isEmptyBody, signupSchemaValidate, signup);
authRouter.post('/login', isEmptyBody, loginSchemaValidate, login);

module.exports = authRouter;