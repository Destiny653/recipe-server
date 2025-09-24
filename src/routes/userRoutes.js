const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    getUserProfile, 
    addFavorite, 
    removeFavorite 
} = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get user's own profile (published recipes and favorites)
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/users/favorites/add/:id
// @desc    Add a recipe to user's favorites
router.put('/favorites/add/:id', auth, addFavorite);

// @route   PUT /api/users/favorites/remove/:id
// @desc    Remove a recipe from user's favorites
router.put('/favorites/remove/:id', auth, removeFavorite);

module.exports = router;