'use strict';
const {
  Model
} = require('sequelize');
const helper = require('../helper');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get formatDate(){
      return helper.formatDate(this.createdAt)
    }
  }
  Profile.init({
    fullName: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    email: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};