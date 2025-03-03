const express = require("express");
const router = express.Router();

//Import controller functions
const {createGame, getAllGames, getGameByGameId, getGameByJoinCode, updateGame, deleteGame} = require("../controllers/gamesController");

//Create a new game
router.post("/", createGame);

//Get all games
router.get("/", getAllGames);

//Get a single game via Game_id
router.get("/:id/game", getGameByGameId);

//Get a single game via Join_code
router.get("/:Join_Code/join", getGameByJoinCode)

//Update a game via Game_id
router.put("/:id/game/update", updateGame);

//Delete a game via Game_id
router.delete("/:id", deleteGame);

//Export router to be used in main 
module.exports = router;