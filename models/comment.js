const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const BlogPost = require('./blogPost');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Comment.belongsTo(BlogPost, { as: 'post', foreignKey: 'postId' });

module.exports = Comment;
