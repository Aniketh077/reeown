const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const wishlistController = require('../controllers/wishlistController');

router.get('/', auth, wishlistController.getWishlist);
router.post('/add', auth, wishlistController.addToWishlist);
router.post('/toggle', auth, wishlistController.toggleWishlist);
router.delete('/:productId', auth, wishlistController.removeFromWishlist);

module.exports = router;
