require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/user');
const BlogPost = require('./models/blogPost');
const Comment = require('./models/comment');
const authRoutes = require('./routes/auth');
const blogPostRoutes = require('./routes/blogPosts');
const commentRoutes = require('./routes/comments');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('SECRET_KEY:', process.env.SECRET_KEY);

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogPosts', blogPostRoutes);
app.use('/api/comments', commentRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;

// Sync sequelize models and start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
