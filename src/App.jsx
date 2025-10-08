// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './component/Header';
import Footer from './component/Footer';
import HomePage from './page/HomePage';
import CategoryPage from './page/CategoryPage';
import BlogDetailsPage from './page/BlogDetailsPage';
import SearchPage from './page/SearchPage';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/post/:postSlug" element={<BlogDetailsPage />} />
        
        {/* THIS IS THE UPDATED ROUTE for search */}
        <Route path="/search/post/:searchTerm" element={<SearchPage />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;