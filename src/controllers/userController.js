const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user's own profile
// @route   GET /api/users/profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password') // Don't return the hashed password
            .populate('recipes', 'title image averageRating') // Populate published recipes
            .populate('favorites', 'title image averageRating'); // Populate favorite recipes

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a recipe to user's favorites
// @route   PUT /api/users/favorites/add/:id
exports.addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Check if recipe is already a favorite
        if (user.favorites.includes(req.params.id)) {
            return res.status(400).json({ msg: 'Recipe is already in your favorites' });
        }

        user.favorites.push(req.params.id);
        await user.save();
        res.json({ msg: 'Recipe added to favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Remove a recipe from user's favorites
// @route   PUT /api/users/favorites/remove/:id
exports.removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check if recipe is in favorites
        const favoriteIndex = user.favorites.indexOf(req.params.id);
        if (favoriteIndex === -1) {
            return res.status(404).json({ msg: 'Recipe not found in favorites' });
        }

        user.favorites.splice(favoriteIndex, 1);
        await user.save();
        res.json({ msg: 'Recipe removed from favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};