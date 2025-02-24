const express = require("express");
const router = express.Router();

//Import controller functions
const {createGame, getAllGames, getGame, updateGame, deleteGame} = require("../controllers/gamesController");

//Create a new user
router.post("/:id", createGame);

//Get all users
router.get("/", getAllGames);

//Get a single user via User_id
router.get("/:id", getGame);

//Update a user via User_id
router.put("/:id", updateGame);

//Delete a user via User_id
router.delete("/:id", deleteGame);

//Export router to be used in main 
module.exports = router;