const express = require("express");
const router = express.Router();

const {signUp, logIn, signOut, deleteAccount, getDisplayName} = require('../controllers/authController');

//Allows a user to sign up for an account
router.post("/signup", signUp);

//Allows user to log in to their account
router.post("/login", logIn);

//Allows user to sign out of an account
router.post("/signout", signOut);

//Allows user to delete an account
router.delete("/deleteaccount", deleteAccount);

//Retrieves user display name
router.get("/getdisplayname", getDisplayName);

module.exports = router;