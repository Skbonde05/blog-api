const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res, next) => {
  try {
    const postId = req.params.postId || req.body.postId;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success:false, error: 'Post not found' });
    const comment = new Comment({ post: post._id, content: req.body.content, author: req.user._id });
    await comment.save();
    res.status(201).json({ success:true, data: comment });
  } catch (err) { next(err); }
};

const listComments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.post_id) filter.post = req.query.post_id;
    const comments = await Comment.find(filter).populate('author', 'username').sort({ createdAt: 1 });
    res.json({ success:true, data: comments });
  } catch (err) { next(err); }
};

const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('author', 'username');
    if (!comment) return res.status(404).json({ success:false, error: 'Not found' });
    res.json({ success:true, data: comment });
  } catch (err) { next(err); }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = req.resource;
    comment.content = req.body.content ?? comment.content;
    await comment.save();
    res.json({ success:true, data: comment });
  } catch (err) { next(err); }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = req.resource;
    await comment.deleteOne();          // 👈 change here
    res.json({ success: true, data: { id: comment._id } });
  } catch (err) {
    next(err);
  }
};


module.exports = { createComment, listComments, getComment, updateComment, deleteComment };
