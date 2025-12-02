const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const validate = require('../utils/validators');

const router = express.Router();

router.post('/register', [
  body('username').isLength({ min:3 }),
  body('email').isEmail(),
  body('password').isLength({ min:6 })
], validate, register);

router.post('/login', [
  body('usernameOrEmail').notEmpty(),
  body('password').notEmpty()
], validate, login);

module.exports = router;
