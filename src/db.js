// Environment variables;
require('dotenv').config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
// Import utilities;
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries;
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed;
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Read all the files from the Models folder, require them and add to the modelDefiners array;
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Inject the connection (sequelize) to all models;
modelDefiners.forEach(model => model(sequelize));
// Capitalize model names;
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// In sequelize.models are all imported models as properties so it destructures them;
const { Recipes, Diets } = sequelize.models;

// Many-to-many relationships to create the intermediate table of values;
Recipes.belongsToMany(Diets, { through: 'DietRecipe', timestamps: false });
Diets.belongsToMany(Recipes, { through: 'DietRecipe', timestamps: false });

// Export of values required in other modules;
module.exports = { ...sequelize.models, conn: sequelize };