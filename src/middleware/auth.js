const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success:false, error: 'Authorization header missing' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ success:false, error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success:false, error: 'Invalid or expired token' });
  }
};

const ensureOwner = (modelFetcher) => async (req, res, next) => {
  try {
    const resource = await modelFetcher(req);
    if (!resource) return res.status(404).json({ success:false, error: 'Not found' });
    if (resource.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, error: 'Forbidden' });
    }
    req.resource = resource;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate, ensureOwner };
