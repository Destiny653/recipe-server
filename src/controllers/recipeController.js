const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Create a new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, preparationSteps, cookingTime, calories, difficulty, cuisine, diet } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newRecipe = new Recipe({
            title,
            description,
            image,
            ingredients: JSON.parse(ingredients),
            preparationSteps: JSON.parse(preparationSteps),
            cookingTime,
            calories,
            difficulty,
            cuisine,
            diet,
            author: req.user.id
        });

        await newRecipe.save();

        // Update the user's recipes list
        await User.findByIdAndUpdate(req.user.id, { $push: { recipes: newRecipe._id } });

        res.status(201).json(newRecipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all recipes with pagination
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const recipes = await Recipe.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('author', 'username')
            .select('title image averageRating cookingTime calories difficulty author');
        const count = await Recipe.countDocuments();
        res.json({
            recipes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
exports.rateRecipe = async (req, res) => {
    try {
        const { rating } = req.body;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        // Check if user has already rated
        const hasRated = recipe.ratings.some(r => r.user.toString() === req.user.id);
        if (hasRated) {
            return res.status(400).json({ msg: 'You have already rated this recipe' });
        }
        recipe.ratings.push({ user: req.user.id, rating });
        // Calculate new average rating
        const totalRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
        recipe.averageRating = totalRating / recipe.ratings.length;
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Advanced search for recipes
// @route   GET /api/recipes/search
exports.searchRecipes = async (req, res) => {
    try {
        const { ingredients, time, calories, cuisine, difficulty, diet } = req.query;
        const query = {};

        // Filter by ingredients
        if (ingredients) {
            query.ingredients = { $in: ingredients.split(',').map(item => new RegExp(item.trim(), 'i')) };
        }
        // Filter by time
        if (time) {
            query.cookingTime = { $lte: Number(time) };
        }
        // Filter by calories
        if (calories) {
            query.calories = { $lte: Number(calories) };
        }
        // Filter by cuisine, diet, difficulty
        if (cuisine) {
            query.cuisine = new RegExp(cuisine, 'i');
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        if (diet) {
            query.diet = new RegExp(diet, 'i');
        }

        const recipes = await Recipe.find(query).select('title image averageRating cookingTime calories difficulty author');
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get recipes published by a specific user
// @route   GET /api/recipes/user/:id
exports.getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.id });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};