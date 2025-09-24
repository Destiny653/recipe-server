const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    preparationSteps: [{ type: String, required: true }],
    cookingTime: { type: Number, required: true }, // In minutes
    calories: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    cuisine: { type: String, required: true },
    diet: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 }
    }],
    averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Recipe', RecipeSchema);