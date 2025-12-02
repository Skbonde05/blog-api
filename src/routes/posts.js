const express = require('express');
const { createPost, listPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const { authenticate, ensureOwner } = require('../middleware/auth');
const Post = require('../models/Post');
const { body } = require('express-validator');
const validate = require('../utils/validators');

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPost);

router.post('/', authenticate, [
  body('title').notEmpty(),
  body('content').notEmpty()
], validate, createPost);

router.put('/:id', authenticate, ensureOwner(async (req) => Post.findById(req.params.id)), [
  body('title').optional(),
  body('content').optional()
], validate, updatePost);

router.delete('/:id', authenticate, ensureOwner(async (req) => Post.findById(req.params.id)), deletePost);

module.exports = router;
