const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user._id });
    await post.save();
    res.status(201).json({ success:true, data: post });
  } catch (err) { next(err); }
};

const listPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
    const skip = (page - 1) * limit;
    const q = req.query.q ? { $text: { $search: req.query.q } } : {};
    const [posts, total] = await Promise.all([
      Post.find(q).populate('author', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(q)
    ]);
    res.json({ success:true, data: posts, meta: { total, page, limit } });
  } catch (err) { next(err); }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ success:false, error: 'Not found' });
    const comments = await Comment.find({ post: post._id }).populate('author', 'username').sort({ createdAt: 1 });
    res.json({ success:true, data: { post, comments } });
  } catch (err) { next(err); }
};

const updatePost = async (req, res, next) => {
  try {
    const post = req.resource;
    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;
    await post.save();
    res.json({ success:true, data: post });
  } catch (err) { next(err); }
};

const deletePost = async (req, res, next) => {
  try {
    const post = req.resource;
    await post.deleteOne();           // 👈 change here
    res.json({ success: true, data: { id: post._id } });
  } catch (err) {
    next(err);
  }
};


module.exports = { createPost, listPosts, getPost, updatePost, deletePost };
