'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.News)
    }

    static async cariCategory(){
      try {
        let dataCategory = await Category.findAll()
        return dataCategory
      } catch (error) {
        throw error
      }
    }
  }
  Category.init({
    categoryName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};