// src/main.jsx

import React from 'react'; // It's good practice to import React
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';

// This is the entry point of your application.
// It renders the main App component into the 'root' div in your index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    {/* The `basename` prop is CRITICAL for deploying to a subfolder. */}
    <BrowserRouter basename="/blogtheme">
      
      <AppProvider>
        <App />
      </AppProvider>

    </BrowserRouter>
  </React.StrictMode>
);