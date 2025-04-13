const express = require("express");
const router = express.Router();

//Import controller functions
const { likeDeck, unlikeDeck, getLikedDecks } = require("../controllers/userLikedDecksController");

//Post a liked deck via Deck_id
router.post("/:Deck_id", likeDeck);

//Delete ("Unlike") a deck via Deck_id
router.delete("/:Deck_id", unlikeDeck);

//Get liked decks via User_id
router.get("/:User_id", getLikedDecks);


//export router
module.exports = router;