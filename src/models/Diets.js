// Necesary imports
const { DataTypes, UUIDV4 } = require('sequelize');

// Export a function that defines the model
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defines the model
  sequelize.define('Diets', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true, },
  }, { timestamps: false });
};