'use strict';
const {
  Model
} = require('sequelize');
const category = require('./category');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      News.belongsTo(models.Category)
    }
  }
  News.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};