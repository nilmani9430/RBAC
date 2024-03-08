
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM('superAdmin', 'branchManager', 'salesPerson'),
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  },

});

User.belongsTo(User, { as: 'superAdmin', foreignKey: 'superAdminId' });
User.hasMany(User, { as: 'branchManagers', foreignKey: 'superAdminId' });

User.belongsTo(User, { as: 'branchManager', foreignKey: 'branchManagerId' });
User.hasMany(User, { as: 'salespersons', foreignKey: 'branchManagerId' });


module.exports = User;



