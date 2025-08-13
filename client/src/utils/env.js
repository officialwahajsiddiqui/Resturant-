/**
 * Environment variable utilities
 * This file provides a centralized way to access environment variables
 * with proper fallbacks and type conversion
 */

/**
 * Get an environment variable with a fallback value
 * @param {string} key - The environment variable key (without the VITE_ prefix)
 * @param {*} fallback - Fallback value if the environment variable is not set
 * @returns {string} The environment variable value or fallback
 */
export const getEnv = (key, fallback = '') => {
  const fullKey = `VITE_${key}`;
  return import.meta.env[fullKey] || fallback;
};

/**
 * Get a boolean environment variable
 * @param {string} key - The environment variable key (without the VITE_ prefix)
 * @param {boolean} fallback - Fallback value if the environment variable is not set
 * @returns {boolean} The environment variable as a boolean
 */
export const getBoolEnv = (key, fallback = false) => {
  const value = getEnv(key, fallback.toString()).toLowerCase();
  return value === 'true' || value === '1';
};

/**
 * Get a numeric environment variable
 * @param {string} key - The environment variable key (without the VITE_ prefix)
 * @param {number} fallback - Fallback value if the environment variable is not set
 * @returns {number} The environment variable as a number
 */
export const getNumEnv = (key, fallback = 0) => {
  const value = getEnv(key, fallback.toString());
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Environment variables used in the application
 */
export const env = {
  // API URLs
  apiUrl: getEnv('API_URL', 'http://localhost:3000/api'),
  
  // Feature flags
  enableBooking: getBoolEnv('ENABLE_BOOKING', true),
  enableTestimonials: getBoolEnv('ENABLE_TESTIMONIALS', true),
  
  // Analytics
  analyticsId: getEnv('ANALYTICS_ID', ''),
  
  // App settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};