const express = require("express");
const router = express.Router();

const {signUp, logIn} = require('../controllers/authController');

//Allows a user to sign up for an account
router.post("/signup", signUp);

//Allows user to log in to their account
router.post("/login", logIn);

module.exports = router;