import axios from './axios';

export const wishlistAPI = {
  getWishlist: async () => {
    const response = await axios.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await axios.post('/wishlist/add', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await axios.delete(`/wishlist/${productId}`);
    return response.data;
  },

  toggleWishlist: async (productId) => {
    const response = await axios.post('/wishlist/toggle', { productId });
    return response.data;
  },

  // Sync guest wishlist with backend on login
  syncWishlist: async (productIds) => {
    const response = await axios.post('/wishlist/sync', { productIds });
    return response.data;
  }
};
