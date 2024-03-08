const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


require("dotenv").config()

exports.sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      const checkUserPresent = await User.findOne({ where: { email } });
  
      if (checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: "User already registered",
        });
      }
  
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      console.log("OTP Generated successfully ", otp);
  
      let result = await OTP.findOne({ where: { otp } });
  
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        
        result = await OTP.findOne({ where: { otp } });
      }
  
      const otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload);
      console.log("OTP BODY", otpBody);
  
  
      res.status(200).json({
        success: true,
        otp:otp,
        message: "OTP sent successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  
  exports.signUp = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      } = req.body;
  
      // Validate
      if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
        return res.status(403).json({
          success: false,
          message: "All fields required",
        });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password values do not match",
        });
      }
  
      const existingUser = await User.findOne({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User is already registered",
        });
      }
  
      const recentOtp = await OTP.findOne({
        where: { email },
        order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      });

      if (!recentOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP not found",
        });
      } else if (otp !== recentOtp.otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
      console.log("OTP matched, hashing started");
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  

  
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      });
  
      return res.status(200).json({
        success: true,
        user,
        message: "User is registered successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again",
      });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: "All fields are required, please try again",
        });
      }
  
      const user = await User.findOne({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User is not registered, please sign up",
        });
      }
      const superAdminId = user.superAdminId;
      const branchManagerId = user.branchManagerId;
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          firstName:user.firstName,
          lastName:user.lastName,
          email: user.email,
          id: user.id,
          accountType: user.accountType,
          superAdminId:user.superAdminId,
          branchManagerId : user.branchManagerId,
        };
  
        
  
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
  
        user.token = token; 
        user.password = undefined;
  
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          /*user: {
            ...user.toJSON(),
            superAdminId,
            branchManagerId,
          },*/
          message: "Logged in successfully",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Login failure, please try again",
      });
    }
  };
  

