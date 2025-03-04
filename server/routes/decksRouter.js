const express = require("express");
const router = express.Router();

//Import controller functions
const {createDeck, getAllDecks, getDeck, getUserDecks, updateDeck, deleteDeck, getCardCount} = require("../controllers/decksController");

//Create a new deck via user_id
router.post("/:id", createDeck);

//Get all decks
router.get("/", getAllDecks);

//Get a single deck via Deck_id
router.get("/:id", getDeck);

//Get all decks associated with a particular user
router.get("/:User_id/decks", getUserDecks)

//Update a deck via Deck_id
router.put("/:id", updateDeck);

//Delete a deck via Deck_id
router.delete("/:id", deleteDeck);

//Get the number of cards in a deck via Deck_id
router.get("/:id/cards/count", getCardCount);

//Export router to be used in main 
module.exports = router;