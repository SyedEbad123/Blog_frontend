// server/server.js (OPTIMIZED & FINAL VERSION)

// 1. IMPORT NECESSARY PACKAGES
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Loads variables from your .env file

// 2. INITIALIZE THE EXPRESS APP
const app = express();
const PORT = 8000;

// 3. SETUP MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// 4. CREATE DATABASE CONNECTION POOL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


/**
 * HOMEPAGE DATA (OPTIMIZED)
 * Fetches all homepage data in parallel and selects only the necessary columns.
 */
app.get('/api/homepage', async (req, res) => {
  try {
    // This SQL statement joins blog_posts with the authors table to get the author name.
    // It selects only the columns needed by the homepage components.
    const sqlQuery = `
      SELECT 
        p.id, p.cat_id, p.title, p.short_des, p.blog_img_lg, p.sub_date, p.url_title,
        a.name as author_name 
      FROM blog_posts p
      LEFT JOIN authors a ON p.auth_id = a.id
    `;
    
    // PERFORMANCE: Run all database queries in parallel instead of one by one.
    const [
      [featuredPosts],
      [secondaryPosts],
      [latestNews],
      [featuredHorizontalPost],
      [horizontalCardData],
      [allStories]
    ] = await Promise.all([
      pool.query(`${sqlQuery} ORDER BY p.sub_date DESC LIMIT 5`),
      pool.query(`${sqlQuery} ORDER BY p.sub_date DESC LIMIT 2 OFFSET 5`),
      pool.query(`${sqlQuery} ORDER BY p.sub_date DESC LIMIT 10 OFFSET 7`),
      pool.query(`${sqlQuery} WHERE p.f_status = 1 ORDER BY p.user_view DESC LIMIT 1`),
      pool.query(`${sqlQuery} ORDER BY p.sub_date DESC LIMIT 3 OFFSET 17`),
      pool.query(`${sqlQuery} ORDER BY p.sub_date DESC`)
    ]);
    
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
 * SINGLE POST PAGE DATA (OPTIMIZED)
 * Fetches a single post, its category, and author details in one efficient query.
 */
app.get('/api/post/:postSlug', async (req, res) => {
  try {
    const { postSlug } = req.params;
    
    // PERFORMANCE: Use LEFT JOINs to get all data in a single database call.
    const [postRows] = await pool.query(
      `SELECT p.*, a.name as author_name, a.author_bio, a.author_avatar, c.cat_display_title, c.cat_url_title 
       FROM blog_posts p
       LEFT JOIN authors a ON p.auth_id = a.id
       LEFT JOIN domain_blog_categories c ON p.cat_id = c.id
       WHERE p.url_title = ?`, 
      [postSlug]
    );
      
    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const post = postRows[0];
    const categoryInfo = { cat_display_title: post.cat_display_title, cat_url_title: post.cat_url_title };

    // This query for related posts is still separate.
    const [relatedPosts] = await pool.query("SELECT id, title, url_title, blog_img_sm, sub_date FROM blog_posts WHERE cat_id = ? AND id != ? ORDER BY sub_date DESC LIMIT 3", [post.cat_id, post.id]);
    
    res.json({ post, relatedPosts, category: categoryInfo });
  } catch (error) {
    console.error("Failed to fetch post data:", error);
    res.status(500).json({ message: "Error fetching post data." });
  }
});

/**
 * ALL CATEGORIES
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
 */
app.get('/api/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const displayTerm = searchTerm.replace(/-/g, ' ');
    const searchQuery = `%${displayTerm}%`;

    const [posts] = await pool.query("SELECT * FROM blog_posts WHERE title LIKE ?", [searchQuery]);
    res.json({ posts, term: displayTerm });
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    res.status(500).json({ message: "Error fetching search results." });
  }
});

/**
 * DOMAIN DETAILS
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