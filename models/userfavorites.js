'use strict';
module.exports = function(sequelize, DataTypes) {
  var userfavorites = sequelize.define('userfavorites', {
    userId: DataTypes.INTEGER,
    restName: DataTypes.STRING,
    yelpId: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        models.userfavorites.belongsTo(models.user);
      }
    }
  });
  return userfavorites;
};