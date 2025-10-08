// src/context/AppContext.js

import React from 'react';
// Import both API functions needed for initial data load
import { getHomepageData, getDomainData } from '../Api/blogData';

// 1. Create the context
const AppContext = React.createContext();

// 2. Create the Provider component to hold our global data
export class AppProvider extends React.Component {
  // The state now holds both domain details and homepage content
  state = {
    domainDetails: null,
    isDomainLoading: true,
    homepageData: null,
    isHomepageLoading: true,
  };

  // This lifecycle method runs once when the component is first mounted
  componentDidMount() {
    this.fetchInitialData();
  }

  // This single function orchestrates the fetching of all initial data
  fetchInitialData = async () => {
    // First, get the hostname from the browser's URL (e.g., 'localhost')
    const hostname = window.location.hostname;
    
    // Fetch both sets of data. `Promise.all` can run these concurrently for efficiency,
    // but fetching sequentially is simpler to read and fine for this use case.
    
    // Fetch the domain-specific data (site name) and update the state
    const domainData = await getDomainData(hostname);
    this.setState({ domainDetails: domainData, isDomainLoading: false });
    
    // Then, fetch the homepage posts and update the state
    const homepageData = await getHomepageData();
    this.setState({ homepageData: homepageData, isHomepageLoading: false });
  };

  render() {
    // 3. Create the value object that will be passed to all consuming components.
    // It's important that this object contains all the state properties.
    const contextValue = {
      domainDetails: this.state.domainDetails,
      isDomainLoading: this.state.isDomainLoading,
      homepageData: this.state.homepageData,
      isHomepageLoading: this.state.isHomepageLoading,
    };
    
    return (
      <AppContext.Provider value={contextValue}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

// 4. Export the context itself as the default export
export default AppContext;