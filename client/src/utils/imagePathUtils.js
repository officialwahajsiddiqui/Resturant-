/**
 * Utility functions for handling image paths consistently across the application
 */

/**
 * Formats an image path to ensure it has the correct server URL prefix
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The properly formatted image URL
 */
export const formatImagePath = (imagePath) => {
  // If path is null or undefined, return default image
  if (!imagePath) {
    console.warn('Image path is null or undefined, using default image');
    return '/img/menu-1.jpg';
  }

  // If path already starts with http/https, it's already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // For paths starting with /uploads, use relative path to avoid CORS issues
  if (imagePath.startsWith('/uploads')) {
    return imagePath;
  }

  // For static images in the public directory
  if (imagePath.startsWith('/img/')) {
    return imagePath;
  }

  // If path doesn't have a leading slash, add it
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`;
  }

  // Default case - use relative path
  return imagePath;
};

/**
 * Handles image loading errors by setting a default image
 * @param {Event} event - The error event
 * @param {string} originalPath - The original image path for logging
 */
export const handleImageError = (event, originalPath) => {
  console.error('Image load error:', originalPath);
  console.log('Attempted URL:', originalPath);
  event.target.onerror = null; // Prevent infinite error loop
  event.target.src = '/img/menu-1.jpg'; // Set default image
};