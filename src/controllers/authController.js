const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.status(201).json({ success:true, data: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success:false, error: 'Username or email already taken' });
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) return res.status(401).json({ success:false, error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success:false, error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ success:true, data: { token } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
