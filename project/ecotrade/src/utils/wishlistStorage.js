const WISHLIST_KEY = 'guestWishlist';

export const wishlistStorage = {
  // Get wishlist from localStorage
  getWishlist: () => {
    try {
      const wishlist = localStorage.getItem(WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  },

  // Save wishlist to localStorage
  saveWishlist: (wishlist) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  },

  // Add product to wishlist
  addToWishlist: (productId) => {
    const wishlist = wishlistStorage.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      wishlistStorage.saveWishlist(wishlist);
    }
    return wishlist;
  },

  // Remove product from wishlist
  removeFromWishlist: (productId) => {
    const wishlist = wishlistStorage.getWishlist();
    const filteredWishlist = wishlist.filter(id => id !== productId);
    wishlistStorage.saveWishlist(filteredWishlist);
    return filteredWishlist;
  },

  // Toggle product in wishlist
  toggleWishlist: (productId) => {
    const wishlist = wishlistStorage.getWishlist();
    const isInWishlist = wishlist.includes(productId);

    if (isInWishlist) {
      return {
        wishlist: wishlistStorage.removeFromWishlist(productId),
        isInWishlist: false
      };
    } else {
      return {
        wishlist: wishlistStorage.addToWishlist(productId),
        isInWishlist: true
      };
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    const wishlist = wishlistStorage.getWishlist();
    return wishlist.includes(productId);
  },

  // Clear wishlist
  clearWishlist: () => {
    localStorage.removeItem(WISHLIST_KEY);
  }
};
