'use strict';
module.exports = (sequelize, DataTypes) => {
  var author = sequelize.define('author', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  }, {});
  author.associate = function(models) {
      this.hasMany(models.post);
  };
  return author;
};
