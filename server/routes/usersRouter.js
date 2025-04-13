const express = require("express");
const router = express.Router();

//Import controller functions
const {createUser, getAllUsers, getUser, getUsersById, updateUser, deleteUser, setUserPrivacy} = require("../controllers/usersController");

//Create a new user
router.post("/", createUser);

//Get all users
router.get("/", getAllUsers);

//Get a single user via User_id
router.get("/:id", getUser);

//Get an array of users via User_id
router.post("/list/", getUsersById);

//Update a user via User_id
router.put("/:id", updateUser);

//Delete a user via User_id
router.delete("/:id", deleteUser);

//Set user to private via User_id
router.put("/:id/privacy", setUserPrivacy);

//Export router to be used in main 
module.exports = router;