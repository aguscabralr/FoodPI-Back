// Environment variables;
require('dotenv').config();
const { API_KEY } = process.env;
// Import utilities;
const axios = require('axios')
// Import model from DB;
const { Diets } = require('../db');

const url = 'https://api.spoonacular.com/recipes';
const aK = `apiKey=${API_KEY}`;

const allDiets = async (req, res) => {
  try {
    const allData = await Diets.findAll();
    if (!allData.length) {
      const { data } = await axios(`${url}/complexSearch?addRecipeInformation=true&number=100&${aK}`);
      const { results } = data;
      let getDiets = new Set();
      results.forEach(recipe => {
        for (let i = 0; i < recipe.diets.length; i++) {
          getDiets.add(recipe.diets[i]);
        };
      });

      const dietsArr = Array.from(getDiets);
      await Diets.bulkCreate(dietsArr.map(diet => ({ name: diet })));
      allData = await Diets.findAll();
    }

    return res.status(200).json(allData);
  } catch (error) {
    return res.status(500).json(error.message);
  };
};

module.exports = { allDiets };