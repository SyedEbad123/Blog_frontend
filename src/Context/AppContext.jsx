// src/context/AppContext.js (OPTIMIZED & MODERNIZED)

import React, { useState, useEffect } from 'react';
import { getHomepageData, getDomainData } from '../Api/blogData';

// 1. Create the context
const AppContext = React.createContext();

// 2. Create the Provider component using a functional component and hooks
export const AppProvider = ({ children }) => {
  const [domainDetails, setDomainDetails] = useState(null);
  const [isDomainLoading, setIsDomainLoading] = useState(true);
  const [homepageData, setHomepageData] = useState(null);
  const [isHomepageLoading, setIsHomepageLoading] = useState(true);

  // This hook runs once when the component is first mounted, similar to componentDidMount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const hostname = window.location.hostname;

        // --- PERFORMANCE OPTIMIZATION: RUNNING REQUESTS IN PARALLEL ---
        // We start both API calls at the same time instead of waiting for one to finish
        // before starting the next. This reduces the total loading time.
        const domainDataPromise = getDomainData(hostname);
        const homepageDataPromise = getHomepageData();

        // Promise.all waits for both promises to resolve
        const [domainData, homepageData] = await Promise.all([
          domainDataPromise,
          homepageDataPromise
        ]);

        // Update the state once after all data has been successfully fetched
        setDomainDetails(domainData);
        setHomepageData(homepageData);

      } catch (error) {
        // If any of the API calls fail, we log the error.
        // The API functions already return default empty data, so the site won't crash.
        console.error("Failed to fetch initial data:", error);
      } finally {
        // This block runs regardless of success or failure, ensuring the loading
        // spinners are always turned off.
        setIsDomainLoading(false);
        setIsHomepageLoading(false);
      }
    };

    fetchInitialData();
  }, []); // The empty array [] ensures this effect runs only once

  // 3. Create the value object that will be passed down to all consuming components.
  const contextValue = {
    domainDetails,
    isDomainLoading,
    homepageData,
    isHomepageLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 4. Export the context itself as the default export
export default AppContext;