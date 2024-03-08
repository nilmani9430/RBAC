// userController.js

const  User  = require('../models/User');
const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken")

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    if (!firstName || !lastName || !email || !password || !accountType) {
      return res.status(403).json({
        success: false,
        message: 'All fields required',
      });
    }

    const loggedInUser = req.user;

    let branchManagerId = null;
    let superAdminId = null;

    // Check if the user has the permission to create the specified role
    if (
      (loggedInUser.accountType === 'superAdmin' &&
        ['branchManager', 'salesPerson'].includes(accountType)) ||
      (loggedInUser.accountType === 'branchManager' && accountType === 'salesPerson')
    ) {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (loggedInUser.accountType === 'branchManager') {
        branchManagerId = loggedInUser.id;
        superAdminId = loggedInUser.superAdminId;
      } else if (loggedInUser.accountType === 'superAdmin') {
        superAdminId = loggedInUser.id;
      }
      if (loggedInUser.accountType === 'branchManager' && accountType === 'salesPerson') {
        superAdminId = loggedInUser.superAdminId;
      }

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        branchManagerId,
        superAdminId,
      });

      const payload = {
        email: newUser.email,
        id: newUser.id,
        accountType: newUser.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });

      return res.status(200).json({
        success: true,
        token,
        // user: newUser,
        message: 'User created successfully',
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Permission denied to create the specified role',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'User cannot be created. Please try again',
    });
  }
};



exports.getUserList = async (req, res) => {
  try {
    // Get the user from the token (assuming you have the user object in the request)
    const loggedInUser = req.user;

    // Check user's account type
    if (loggedInUser.accountType === 'superAdmin') {
      // Fetch lists of all Branch Managers and Salespersons for the logged-in superAdmin
      const userList = await User.findAll({
        where: { superAdminId: loggedInUser.id },
      });

      return res.status(200).json({
        success: true,
        userList,
        message: 'User list fetched successfully',
      });
    } else if (loggedInUser.accountType === 'branchManager') {
      // Fetch list of all Salespersons for the logged-in branchManager
      const userList = await User.findAll({
        where: { branchManagerId: loggedInUser.id },
      });

      return res.status(200).json({
        success: true,
        userList,
        message: 'User list fetched successfully',
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Permission denied to fetch user list',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user list. Please try again',
    });
  }
};



exports.getSelf = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userInfo = {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      accountType: loggedInUser.accountType,
      image: loggedInUser.image,
      branchManagerId: loggedInUser.branchManagerId || null,
      superAdminId: loggedInUser.superAdminId || null,
    };

    return res.status(200).json({
      success: true,
      user: userInfo,
      message: 'User information fetched successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user information. Please try again',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userIdToDelete = req.params.userId;

    const userToDelete = await User.findByPk(userIdToDelete);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (
      loggedInUser.accountType === 'superAdmin' ||
      (loggedInUser.accountType === 'branchManager' && userToDelete.branchManagerId === loggedInUser.id)
    ) {
      await User.destroy({
        where: {
          id: userIdToDelete,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Permission denied to delete the specified user',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting user. Please try again',
    });
  }
};


