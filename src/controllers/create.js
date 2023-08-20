// Import model from DB;
const { Recipes, Diets, DietRecipe } = require('../db');

const postRecipe = async (req, res) => {
  try {
    const { title, image, summary, healthScore, analyzedInstructions, diets } = req.body;

    const formatInstructions = [{ "name": "", "steps": [] }];
    for (let i = 0; i < analyzedInstructions.length; i++) {
      const newStep = {};
      newStep.number = i + 1;
      newStep.step = analyzedInstructions[i];
      newStep.ingredients = [];
      formatInstructions[0].steps.push(newStep);
    };

    const newRecipe = {
      title,
      image,
      summary,
      healthScore,
      analyzedInstructions: formatInstructions,
    };

    const newRecipeDB = await Recipes.create(newRecipe);

    if (diets.length) {
      const dietsPromises = diets.map(async (diet) => {
        const dietsMatch = await Diets.findOne({ where: { name: diet } });
        return { id: dietsMatch.id, name: dietsMatch.name };
      });
      const dietsRecipe = await Promise.all(dietsPromises);
      await newRecipeDB.addDiets(dietsRecipe.map(diet => diet.id));
      return res.status(201).json(newRecipeDB.id);
    } else {
      return res.status(201).json(newRecipeDB.id);
    };
  } catch (error) {
    return res.status(500).json(error.message);
  };
};

const putRecipe = async (req, res) => {
  try {
    const { id, title, image, summary, healthScore, analyzedInstructions, diets } = req.body;

    const formatInstructions = [{ "name": "", "steps": [] }];
    for (let i = 0; i < analyzedInstructions.length; i++) {
      const newStep = {};
      newStep.number = i + 1;
      newStep.step = analyzedInstructions[i];
      newStep.ingredients = [];
      formatInstructions[0].steps.push(newStep);
    };

    await Recipes.update({
      title,
      image,
      summary,
      healthScore,
      analyzedInstructions: formatInstructions
    }, { where: { id } });

    await DietRecipe.destroy({ where: { RecipeId: id } });

    if (diets.length) {
      diets.map(async (diet) => {
        const dietMatch = await Diets.findOne({ where: { name: diet } })
        if (dietMatch) {
          await DietRecipe.create({ RecipeId: id, DietId: dietMatch.id })
        };
      });
      return res.status(200).json(id);
    } else {
      return res.status(200).json(id);
    };
  } catch (error) {
    return res.status(500).json(error.message);
  };
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Recipes.destroy({ where: { id } });
    await DietRecipe.destroy({ where: { RecipeId: id } });
    return res.status(200).json('deleted');
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = { postRecipe, putRecipe, deleteRecipe };