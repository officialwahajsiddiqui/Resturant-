import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Returns an object with boolean flags for different screen sizes
 * and the current window width
 */
const useResponsive = () => {
  // Initialize with default values
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [responsive, setResponsive] = useState({
    isMobile: window.innerWidth < 576,
    isTablet: window.innerWidth >= 576 && window.innerWidth < 992,
    isDesktop: window.innerWidth >= 992,
    isLargeDesktop: window.innerWidth >= 1200
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Update window width
      setWindowWidth(window.innerWidth);
      
      // Update responsive state
      setResponsive({
        isMobile: window.innerWidth < 576,
        isTablet: window.innerWidth >= 576 && window.innerWidth < 992,
        isDesktop: window.innerWidth >= 992,
        isLargeDesktop: window.innerWidth >= 1200
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return {
    ...responsive,
    windowWidth
  };
};

export default useResponsive;