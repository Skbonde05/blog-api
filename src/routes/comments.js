const express = require('express');
const { createComment, listComments, getComment, updateComment, deleteComment } = require('../controllers/commentController');
const { authenticate, ensureOwner } = require('../middleware/auth');
const Comment = require('../models/Comment');
const { body } = require('express-validator');
const validate = require('../utils/validators');

const router = express.Router();

router.get('/', listComments);
router.get('/:id', getComment);

router.post('/posts/:postId/comments', authenticate, [
  body('content').notEmpty()
], validate, createComment);

router.post('/', authenticate, [
  body('postId').notEmpty(),
  body('content').notEmpty()
], validate, createComment);

router.put('/:id', authenticate, ensureOwner(async (req) => Comment.findById(req.params.id)), [
  body('content').notEmpty()
], validate, updateComment);

router.delete('/:id', authenticate, ensureOwner(async (req) => Comment.findById(req.params.id)), deleteComment);

module.exports = router;
