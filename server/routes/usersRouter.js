const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit

//Import controller functions
const {createUser, getAllUsers, 
    getUser, getUsersById, updateUser, 
    deleteAccount, setUserPrivacy, 
    updateUsername, updateProfilePic} 
    = require("../controllers/usersController");

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
router.delete('/deleteaccount', deleteAccount);

//Set user to private via User_id
router.put("/:id/privacy", setUserPrivacy);

//Updates a username via User_id
router.put("/:id/username", updateUsername);

//Updates a user's storage with a profile picture
router.post("/:id/profile-pic", upload.single('file'), updateProfilePic);

//Export router to be used in main 
module.exports = router;