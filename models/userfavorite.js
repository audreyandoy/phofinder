'use strict';
module.exports = function(sequelize, DataTypes) {
  var userfavorite = sequelize.define('userfavorite', {
    userId: DataTypes.INTEGER,
    restName: DataTypes.STRING,
    yelpId: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        models.userfavorite.belongsTo(models.user);
      }
    }
  });
  return userfavorite;
};