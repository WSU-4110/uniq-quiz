const express = require("express");
const router = express.Router();

//Import controller functions
const {createDeck, getAllDecks, getAllDecksWithAuthors, getDeck, getUserDecks, getGroupDecks, updateDeck, deleteDeck, getCardCount} = require("../controllers/decksController");

//Create a new deck via user_id
router.post("/", createDeck);

//Get all decks
router.get("/", getAllDecks);

//Get all decks with authors
router.get("/authors", getAllDecksWithAuthors)

//Get a single deck via Deck_id
router.get("/:id", getDeck);

//Get a count of decks belonging to a user via User_id
router.get("/:User_id/user_decks", getUserDecks);

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