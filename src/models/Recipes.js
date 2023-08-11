// Necesary imports
const { DataTypes } = require('sequelize');

// Export a function that defines the model
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defines the model
	sequelize.define('Recipes', {
		id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
		title: { type: DataTypes.STRING, allowNull: false, unique: true, },
		image: { type: DataTypes.STRING(1000), allowNull: false, },
		summary: { type: DataTypes.STRING, allowNull: false, },
		healthScore: { type: DataTypes.INTEGER, allowNull: false, },
		analyzedInstructions: { type: DataTypes.JSONB, allowNull: false, },
	}, { timestamps: false });
};