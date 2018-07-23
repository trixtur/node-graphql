'use strict';
module.exports = (sequelize, DataTypes) => {
  var author = sequelize.define('author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  }, {});
  author.associate = function(models) {
      this.hasMany(models.post);
  };
  return author;
};
