
const express = require('express');
// const authController = require('../controllers/Auth');

const router = express.Router();
const {
    login,
    signUp,
    sendOTP,
} = require("../controllers/Auth")

const {auth} = require("../middlewares/authMiddleware")


router.post("/login",login)

router.post('/signup', signUp);

router.post('/sendotp',sendOTP)

module.exports = router;
