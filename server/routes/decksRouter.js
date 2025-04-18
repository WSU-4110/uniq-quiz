const express = require("express");
const router = express.Router();

//Import controller functions
const {createDeck, getAllDecks, getDeck, getUserDecks, getNotUserDecks, getUserDecksCount, getGroupDecks, updateDeck, deleteDeck, getCardCount} = require("../controllers/decksController");

//Create a new deck via user_id
router.post("/", createDeck);

//Get all decks
router.get("/", getAllDecks);

//Get a single deck via Deck_id
router.get("/:id", getDeck);

//Get all decks associated with a particular User_id
router.get("/:User_id/user_decks", getUserDecks);

//Get all decks NOT associated with a particular User_id
router.get("/:User_id/other_decks", getNotUserDecks);

//Get a count of decks belonging to a user via User_id
router.get("/:User_id/count", getUserDecksCount);

//Get all decks belonging to a group via Group_id
router.get("/:Group_id/group_decks", getGroupDecks)

//Update a deck via Deck_id
router.put("/:id", updateDeck);

//Delete a deck via Deck_id
router.delete("/:id", deleteDeck);

//Get the number of cards in a deck via Deck_id
router.get("/:id/cards/count", getCardCount);

//Export router to be used in main 
module.exports = router;