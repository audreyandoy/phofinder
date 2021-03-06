'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 99]
      }
    },
    locationId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.userfavorites);
      },
      authenticate: function(email, password, callback) {
        this.find({
          where: {email: email}
        }).then(function(user) {
          if (!user) return callback(null, false);
          bcrypt.compare(password, user.password, function(err, result) {
            if (err) return callback(err);
            callback(null, result ? user : false);
          });
        }).catch(callback);
      }
    },
     hooks: { //runs before validation and will throw an error about no pw. 
      beforeCreate: function(user, options, callback) {
        if (user.password) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            user.password = hash;
             if (err) return callback(err);
             console.log("hash"+ user.password);
            //  callback(null,user);
          });            
        } else {
          console.log(err)
          callback(null,user);
        }
      }
    }
  });
  return user;
};