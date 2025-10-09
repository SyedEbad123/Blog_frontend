// server/server.js

// 1. IMPORT NECESSARY PACKAGES
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Loads variables from your .env file

// 2. INITIALIZE THE EXPRESS APP
const app = express();
const PORT = 8000; // The port your backend server will run on

// 3. SETUP MIDDLEWARE
app.use(cors()); // Allows your React app (frontend) to make requests to this server
app.use(express.json()); // Allows the server to understand JSON data sent from the frontend
app.use('/public', express.static('public')); // Serves static files (like images) from the 'public' folder

// 4. CREATE DATABASE CONNECTION POOL (WITH SSL ENABLED)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // --- THIS IS THE FINAL FIX ---
  ssl: { rejectUnauthorized: false } 
});


/**
 * HOMEPAGE DATA
 * Fetches all the different sets of posts needed to build the homepage.
 */
app.get('/api/homepage', async (req, res) => {
  try {
    const [featuredPosts] = await pool.query("SELECT * FROM blog_posts ORDER BY sub_date DESC LIMIT 5");
    const [secondaryPosts] = await pool.query("SELECT * FROM blog_posts ORDER BY sub_date DESC LIMIT 2 OFFSET 5");
    const [latestNews] = await pool.query("SELECT * FROM blog_posts ORDER BY sub_date DESC LIMIT 10 OFFSET 7");
    const [featuredHorizontalPost] = await pool.query("SELECT * FROM blog_posts WHERE f_status = 1 ORDER BY user_view DESC LIMIT 1");
    const [horizontalCardData] = await pool.query("SELECT * FROM blog_posts ORDER BY sub_date DESC LIMIT 3 OFFSET 17");
    const [allStories] = await pool.query("SELECT * FROM blog_posts ORDER BY sub_date DESC");
    
    res.json({ 
      featuredPosts, 
      secondaryPosts, 
      latestNews, 
      featuredHorizontalPost: featuredHorizontalPost[0] || null, 
      horizontalCardData, 
      allStories 
    });
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    res.status(500).json({ message: "Error fetching data from database." });
  }
});

/**
 * CATEGORY PAGE DATA
 * Fetches details for a specific category and all the posts within it.
 */
app.get('/api/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    
    const [categoryRows] = await pool.query("SELECT * FROM domain_blog_categories WHERE cat_url_title = ?", [categorySlug]);
    if (categoryRows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const categoryDetails = categoryRows[0];
    const [posts] = await pool.query("SELECT * FROM blog_posts WHERE cat_id = ? ORDER BY sub_date DESC", [categoryDetails.id]);
    
    res.json({ details: categoryDetails, posts: posts });
  } catch (error) {
    console.error("Failed to fetch category data:", error);
    res.status(500).json({ message: "Error fetching category data." });
  }
});

/**
 * SINGLE POST PAGE DATA
 * Fetches a single post, its category details, and related posts.
 */
app.get('/api/post/:postSlug', async (req, res) => {
  try {
    const { postSlug } = req.params;
    
    const [postRows] = await pool.query("SELECT * FROM blog_posts WHERE url_title = ?", [postSlug]);
    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const post = postRows[0];
    const [relatedPosts] = await pool.query("SELECT * FROM blog_posts WHERE cat_id = ? AND id != ? ORDER BY sub_date DESC LIMIT 3", [post.cat_id, post.id]);
    const [categoryRows] = await pool.query("SELECT * FROM domain_blog_categories WHERE id = ?", [post.cat_id]);
    
    res.json({ post, relatedPosts, category: categoryRows[0] || null });
  } catch (error) {
    console.error("Failed to fetch post data:", error);
    res.status(500).json({ message: "Error fetching post data." });
  }
});

/**
 * ALL CATEGORIES (for Header Navigation)
 * Fetches a simple list of categories filtered by a specific domain name.
 */
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT id, cat_display_title, cat_url_title FROM domain_blog_categories WHERE domain_name = 'thatgirlmags.com' AND status = 1 ORDER BY sortnum ASC"
    );
    res.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ message: "Error fetching categories." });
  }
});

/**
 * SEARCH POSTS
 * Fetches posts from the database that match a search term in their title.
 */
app.get('/api/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const searchQuery = `%${searchTerm.replace(/-/g, ' ')}%`;
    const [posts] = await pool.query("SELECT * FROM blog_posts WHERE title LIKE ?", [searchQuery]);
    res.json({ posts, term: searchTerm.replace(/-/g, ' ') });
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    res.status(500).json({ message: "Error fetching search results." });
  }
});

/**
 * DOMAIN DETAILS
 * Fetches site-specific details (like title) based on the hostname.
 */
app.get('/api/domain-details/:hostname', async (req, res) => {
    try {
    
      const forcedHostname = 'thatgirlmags.com'; 
      
      const [domainRows] = await pool.query("SELECT * FROM domains WHERE domain = ?", [forcedHostname]);
      
      if (domainRows.length === 0) {
        return res.status(404).json({ message: `Domain details not found for '${forcedHostname}'.` });
      }
      
      res.json(domainRows[0]);
  
    } catch (error) {
      console.error("Failed to fetch domain details:", error);
      res.status(500).json({ message: "Error fetching domain details." });
    }
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});