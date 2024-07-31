const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const BlogPost = require('../models/blogPost');
const User = require('../models/user');
const router = express.Router();

// Create a new blog post
router.post('/', [authenticateJWT, authorizeRoles('admin', 'author')], async (req, res) => {
    const { title, content, status } = req.body;
    const blogPost = await BlogPost.create({ title, content, status, authorId: req.user.id });
    res.status(201).json(blogPost);
});

// Get all blog posts with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const blogPosts = await BlogPost.findAndCountAll({
        limit,
        offset,
        include: [{ model: User, as: 'author', attributes: ['username'] }],
    });
    res.json(blogPosts);
});

// Get a specific blog post by ID
router.get('/:id', async (req, res) => {
    const blogPost = await BlogPost.findByPk(req.params.id, {
        include: [{ model: User, as: 'author', attributes: ['username'] }],
    });
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found.' });
    res.json(blogPost);
});

// Update a blog post
router.put('/:id', [authenticateJWT, authorizeRoles('admin', 'author')], async (req, res) => {
    const blogPost = await BlogPost.findByPk(req.params.id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found.' });
    if (blogPost.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only edit your own posts.' });
    }
    const { title, content, status } = req.body;
    await blogPost.update({ title, content, status });
    res.json(blogPost);
});

// Delete a blog post
router.delete('/:id', [authenticateJWT, authorizeRoles('admin', 'author')], async (req, res) => {
    const blogPost = await BlogPost.findByPk(req.params.id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found.' });
    if (blogPost.authorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only delete your own posts.' });
    }
    await blogPost.destroy();
    res.json({ message: 'Blog post deleted successfully.' });
});

module.exports = router;
