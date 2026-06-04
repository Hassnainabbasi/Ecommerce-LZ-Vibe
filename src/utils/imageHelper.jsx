// // src/utils/imageHelper.js
// const backendApi = import.meta.env.VITE_API_BASE
// /**
//  * Converts any image path to full URL
//  * @param {string} imagePath - Image path from database
//  * @returns {string} Full image URL
//  */
// export const getImageUrl = (imagePath) => {
//   if (!imagePath) return '/images/placeholder.png';
//   if (imagePath.startsWith('http')) return imagePath;
//   if (imagePath.startsWith('/uploads')) return backendApi + imagePath;
//   return backendApi + imagePath;
// };

// export default getImageUrl;
// src/utils/imageHelper.js
const backendApi = import.meta.env.VITE_API_BASE || "";

/**
 * Converts any image path to full URL
 * Handles both Single String paths and Arrays safely
 * @param {string|string[]} imagePath - Image path or Array of paths from database
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  // 1. Agar array pass hua hai, to uski pehli image string nikal lo
  if (Array.isArray(imagePath)) {
    imagePath = imagePath[0];
  }

  // 2. Base checks for null, undefined or empty string
  if (!imagePath || typeof imagePath !== 'string') {
    return '/images/placeholder.png';
  }

  // 3. Absolute URL check
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // 4. Relative uploads folder check
  if (imagePath.startsWith('/uploads')) {
    return backendApi + imagePath;
  }

  return backendApi + imagePath;
};
 
export default getImageUrl;