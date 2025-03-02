const express = require("express");
const router = express.Router();

//Import controller functions
const {createGame, getAllGames, getGame, updateGame, deleteGame} = require("../controllers/gamesController");

//Create a new game by Host_id
router.post("/:Host_id", createGame);

//Get all games
router.get("/", getAllGames);

//Get a single game via Game_id
router.get("/:id/game", getGame);

//Update a game via Game_id
router.put("/:id/game/update", updateGame);

//Delete a game via Game_id
router.delete("/:id", deleteGame);

//Export router to be used in main 
module.exports = router;