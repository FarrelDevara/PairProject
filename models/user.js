'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
const helper = require('../helper');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Comment)
    }

    
  }
  User.init({
    username: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : "usesrname tidak boleh kosong"
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      validate : {
        minimalLength(value){
          if (value.length < 5) {
            throw new Error('panjang password minimal 5 huruf');
          }
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks:{
      beforeCreate(data){
        data.role = "user"

        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(data.password,salt)
        data.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};