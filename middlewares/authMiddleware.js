
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
// const { request } = require("../config/express");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    console.log(req.headers.cookie);
    if (!req.headers.cookie) {

      return res.status(401).json({
        success: false,
        message: "Cookie header is missing",
      });
    }
    // console.log("cookie",requestcookie);
    const cookies = req.headers.cookie.split(';');

    let token = null;
    cookies.forEach((cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key === 'token') {
        token = value;
      }
    });
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "superAdmin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for superAdmin only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};


exports.isBranchManager = async (req, res, next) => {
  try {
    if (req.user.accountType !== "branchManager") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Branch Manager only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

exports.isSalesPerson = async (req, res, next) => {
  try {
    if (req.user.accountType !== "salesPerson") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Sales Person only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

exports.checkRole =(roles)=>{
  return async (req, res, next) => {
    try {
      const found= roles.includes(req.user.accountType );
      if (!found) {
        return res.status(403).json({
          success:false,
          message:"You are not authorized to perform this action"
          })
          }
          next()
          }catch(err){
            console.log(err);
            }
            }
            }

//       const user = await User.findByPk(req.user.id);

//       if (!roles.includes(user.accountType)) {
//         return res
//           .status(403)
//           .json({ error: "Forbidden: Insufficient permissions" });
//       }

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
// }
