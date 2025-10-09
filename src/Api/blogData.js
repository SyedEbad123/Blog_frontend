// src/Api/blogData.js

import axios from 'axios';

// The base URL for all API requests to the backend server.
const API_URL = '/api';

/**
 * Fetches all the necessary data for the homepage.
 */
export async function getHomepageData() {
  try {
    const response = await axios.get(`${API_URL}/homepage`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch homepage data:", error);
    // Return a default, empty structure so the website doesn't crash if the server is down.
    return {
      featuredPosts: [],
      secondaryPosts: [],
      latestNews: [],
      featuredHorizontalPost: null,
      horizontalCardData: [],
      allStories: [],
    };
  }
}

/**
 * Fetches all data needed for a specific category page.
 * @param {string} categorySlug The URL slug of the category.
 */
export async function getCategoryPageData(categorySlug) {
  try {
    const response = await axios.get(`${API_URL}/category/${categorySlug}`);
    return response.data;
  } catch (error) {
    console.error(`Could not fetch data for category ${categorySlug}:`, error);
    // Return an empty structure so the page doesn't crash.
    return { details: null, posts: [] };
  }
}

/**
 * Fetches all data for the single post page.
 * @param {string} postSlug The URL slug of the post.
 */
export async function getPostPageData(postSlug) {
  try {
    const cleanSlug = postSlug.startsWith('/') ? postSlug.substring(1) : postSlug;
    const response = await axios.get(`${API_URL}/post/${cleanSlug}`);
    return response.data;
  } catch (error) {
    console.error(`Could not fetch data for post ${postSlug}:`, error);
    // Return an empty structure so the page doesn't crash.
    return { post: null, relatedPosts: [], category: null };
  }
}

/**
 * Fetches the list of all categories for the navigation header.
 */
export async function getAllCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch categories:", error);
    // Return an empty array on error so the header doesn't crash.
    return [];
  }
}

/**
 * Fetches search results from the API.
 * @param {string} searchTerm The term to search for.
 */
export async function getSearchResults(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error(`Could not fetch search results for ${searchTerm}:`, error);
    // Return empty results on error so the page doesn't crash.
    return { posts: [], term: searchTerm };
  }
}

/**
 * Fetches domain-specific data like site title based on the hostname.
 * @param {string} hostname The current window's hostname (e.g., 'localhost')
 */
export async function getDomainData(hostname) {
    try {
      const response = await axios.get(`${API_URL}/domain-details/${hostname}`);
      return response.data;
    } catch (error) {
      console.error(`Could not fetch data for domain ${hostname}:`, error);
      // Return a default object with a fallback title so the site doesn't crash.
      return { site_title: "My Blog" };
    }
}