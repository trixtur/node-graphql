'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    authorId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    votes: DataTypes.INTEGER
  }, {});
  post.associate = function(models) {
      this.belongsTo(models.author);
  };
  return post;
};
