const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate');
const sendVerificationEmail = require('../utils/mailSender');

const OTP = sequelize.define(
  'OTP',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (otpInstance, options) => {
        await sendVerificationEmail(
          otpInstance.email,
          'Verification e-mail from Gamerstag',
          emailVerificationTemplate.otpTemplate(otpInstance.otp)
        );
      },
    },
  }
);


module.exports = OTP;
