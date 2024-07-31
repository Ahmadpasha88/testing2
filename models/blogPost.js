const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const BlogPost = sequelize.define('BlogPost', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft',
    },
});

BlogPost.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = BlogPost;
