const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
    createRecipe, 
    getRecipes, 
    getRecipeById, 
    searchRecipes, 
    rateRecipe, 
    getUserRecipes 
} = require('../controllers/recipeController');

// @route   POST /api/recipes
// @desc    Create a new recipe
router.post('/', auth, upload, createRecipe);

// @route   GET /api/recipes
// @desc    Get all recipes with pagination
router.get('/', getRecipes);

// @route   GET /api/recipes/search
// @desc    Advanced search for recipes
router.get('/search', searchRecipes);

// @route   GET /api/recipes/user/:id
// @desc    Get recipes published by a specific user
router.get('/user/:id', getUserRecipes);

// @route   GET /api/recipes/:id
// @desc    Get a single recipe by ID
router.get('/:id', getRecipeById);

// @route   POST /api/recipes/:id/rate
// @desc    Rate a recipe
router.post('/:id/rate', auth, rateRecipe);

module.exports = router;