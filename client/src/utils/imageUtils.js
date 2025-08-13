/**
 * Utility functions for handling images in React components
 */

// Function to get the correct path for images
export const getImagePath = (imageName) => {
  // In development, images are served from the public directory
  return `/${imageName}`;
};

// Function to import team member images
export const getTeamMemberImage = (number) => {
  return getImagePath(`img/team-${number}.jpg`);
};

// Function to import menu images
export const getMenuImage = (number) => {
  return getImagePath(`img/menu-${number}.jpg`);
};

// Function to import testimonial images
export const getTestimonialImage = (number) => {
  return getImagePath(`img/testimonial-${number}.jpg`);
};

// Function to import about images
export const getAboutImage = (number) => {
  return getImagePath(`img/about-${number}.jpg`);
};

// Other specific image paths
export const heroImage = getImagePath('img/hero.png');
export const bgHeroImage = getImagePath('img/bg-hero.jpg');
export const videoImage = getImagePath('img/video.jpg');