const express = require("express");
const router = express.Router();

//Import controller functions
const {createCard, getCard, getCardByCardId, updateCard, deleteCard} = require("../controllers/cardsController");

//Create a new card via Deck_id
router.post("/:id", createCard);

//Get a card via Deck_id
router.get("/:id", getCard);

//Get a card via Card_id
router.get("/:id/card", getCardByCardId);

//Update a card via Card_id
router.put("/:id", updateCard);

//Delete a card via Card_id
router.delete("/:id", deleteCard);

//Export router to be used in main 
module.exports = router;