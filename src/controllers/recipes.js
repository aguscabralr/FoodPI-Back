// Environment variables;
require('dotenv').config();
const { API_KEY } = process.env;
// Import utilities;
const axios = require('axios');
const { Op } = require("sequelize");
// Import model from DB;
const { Recipes, Diets, DietRecipe } = require('../db');

// Necesary const;
const url = 'https://api.spoonacular.com/recipes';
const aK = `apiKey=${API_KEY}`;

const dietsDB = async (id) => {
  const dietsRecipeDB = await DietRecipe.findAll({ where: { RecipeId: `${id}` } });
  if (dietsRecipeDB.length) {
    let dietsArray = [];
    for (let i = 0; i < dietsRecipeDB.length; i++) {
      const dietName = await Diets.findOne({ where: { id: dietsRecipeDB[i].DietId, } });
      dietsArray.push(dietName.name);
    };
    return dietsArray;
  } else return []
};

const getRecipes = async (req, res) => {
  try {
    const responseDB = await Recipes.findAll();
    const recipesDB = await Promise.all(responseDB.map(async (recipe) => {
      const dietsArray = await dietsDB(recipe.id);
      return ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        analyzedInstructions: recipe.analyzedInstructions,
        diets: dietsArray,
      });
    }));

    const { data } = await axios(`${url}/complexSearch?addRecipeInformation=true&number=100&${aK}`);
    const { results } = data;

    const recipes = recipesDB.concat(results);
    const allRecipes = recipes.map((recipe) => {
      return ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        analyzedInstructions: recipe.analyzedInstructions,
        diets: recipe.diets,
      });
    });
    if (recipes.length) return res.status(200).json(allRecipes);
    else {
      alert('Recipes not found or Error with the response')
      return res.status(404).send('Recipes Not Found');
    };
  } catch (error) {
    return res.status(500).json(error.message);
  };
};

const getRecipesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.includes('-')) {
      const responseDB = await Recipes.findOne({ where: { id: `${id}` } });
      const dietsArray = await dietsDB(responseDB.id);
      const recipeDB = {
        id: responseDB.id,
        title: responseDB.title,
        image: responseDB.image,
        summary: responseDB.summary,
        healthScore: responseDB.healthScore,
        analyzedInstructions: responseDB.analyzedInstructions,
        diets: dietsArray,
      }
      if (recipeDB) return res.status(200).json(recipeDB);
      else {
        alert(`Error searching the id ${id}`);
        return res.status(404).send(`${id} don´t match with any recipe`);
      }
    } else {
      const { data } = await axios(`${url}/${id}/information?${aK}&includeNutrition=false`);
      const { title, diets, image, summary, healthScore, analyzedInstructions } = data;
      const recipe = { id, title, diets, image, summary, healthScore, analyzedInstructions };
      if (recipe) return res.status(200).json(recipe);
      else {
        alert(`Error searching the id ${id}`);
        return res.status(404).send(`${id} don´t match with any recipe`);
      };
    };
  } catch (error) {
    return res.status(500).json(error.message);
  };
};

const getRecipesByName = async (req, res) => {
  try {
    const { name } = req.query;
    const nameRecipesDB = await Recipes.findAll({ where: { title: { [Op.iLike]: `%${name}%` } } });
    const recipesDB = await Promise.all(nameRecipesDB.map(async (recipe) => {
      const dietsArray = await dietsDB(recipe.id);
      return ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        analyzedInstructions: recipe.analyzedInstructions,
        diets: dietsArray,
      });
    }));

    const { data } = await axios(`${url}/complexSearch?query=${name}&addRecipeInformation=true&${aK}`);
    const { results } = data;
    const nameRecipes = recipesDB.concat(results);
    const allNameRecipes = nameRecipes.map((recipe) => {
      return ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        analyzedInstructions: recipe.analyzedInstructions,
        diets: recipe.diets,
      });
    });
    if (allNameRecipes.length) return res.status(200).json(allNameRecipes);
    else {
      allNameRecipes.push(false);
      return res.status(404).json(allNameRecipes);
    };
  } catch (error) {
    return res.status(500).send(error.message);
  };
};

module.exports = { getRecipes, getRecipesById, getRecipesByName };
