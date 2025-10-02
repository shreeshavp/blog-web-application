const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('styling'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for blog posts (resets on server restart)
let blogPosts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    content: "This is the first post on my blog. I'm excited to share my thoughts and experiences with you all. Stay tuned for more interesting content!",
    author: "Blog Admin",
    date: new Date().toLocaleDateString(),
    excerpt: "Welcome to my blog where I share my thoughts and experiences..."
  },
  {
    id: 2,
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful JavaScript runtime that allows you to build server-side applications. In this post, I'll share some tips for beginners who want to get started with Node.js development.",
    author: "Tech Writer",
    date: new Date().toLocaleDateString(),
    excerpt: "Learn the basics of Node.js development and get started with server-side JavaScript..."
  }
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    posts: blogPosts,
    title: 'My Blog - Home'
  });
});

app.get('/create', (req, res) => {
  res.render('create', { 
    title: 'Create New Post'
  });
});

app.post('/create', (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content || !author) {
    return res.status(400).render('create', { 
      title: 'Create New Post',
      error: 'All fields are required!'
    });
  }

  const newPost = {
    id: blogPosts.length + 1,
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    date: new Date().toLocaleDateString(),
    excerpt: content.trim().substring(0, 100) + '...'
  };

  blogPosts.unshift(newPost); // Add to beginning of array
  res.redirect('/');
});

app.get('/post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).render('404', { 
      title: 'Post Not Found'
    });
  }

  res.render('post', { 
    post: post,
    title: post.title
  });
});

app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
