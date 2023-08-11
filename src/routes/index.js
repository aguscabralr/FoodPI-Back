// Import Router;
const { Router } = require('express');
// Import controllers;
const { allDiets } = require('../controllers/diets');
const { postRecipe, putRecipe, deleteRecipe } = require('../controllers/create');
const { getRecipes, getRecipesById, getRecipesByName } = require('../controllers/recipes');
// Router creation;
const router = Router();

// Routers configuration;
router.get('/recipes', getRecipes);
router.get('/recipes/id/:id', getRecipesById);
router.get('/recipes/name', getRecipesByName);
router.get('/diets', allDiets);
router.post('/recipes', postRecipe);
router.put('/recipes', putRecipe);
router.delete('/recipes/:id', deleteRecipe);

// // Export of values required in other modules;
module.exports = router;