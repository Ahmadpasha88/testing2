const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const Comment = require('../models/comment');
const BlogPost = require('../models/blogPost');
const router = express.Router();

// Create a new comment
router.post('/:postId', authenticateJWT, async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.create({ content, authorId: req.user.id, postId: req.params.postId });
    res.status(201).json(comment);
});

// Get all comments for a specific post
router.get('/:postId', authenticateJWT, async (req, res) => {
    const comments = await Comment.findAll({
        where: { postId: req.params.postId, approved: true },
        include: [{ model: User, as: 'author', attributes: ['username'] }],
    });
    res.json(comments);
});

// Approve a comment
router.put('/approve/:id', [authenticateJWT, authorizeRoles('admin')], async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    await comment.update({ approved: true });
    res.json(comment);
});

// Delete a comment
router.delete('/:id', [authenticateJWT, authorizeRoles('admin')], async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully.' });
});

module.exports = router;
