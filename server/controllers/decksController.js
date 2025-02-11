const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

//middleware
app.use(cors());
app.use(express.json()); //req.body

/**
 * create deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {string} User_id       this is user in query
 * @property {string} Title         this is title in query
 * @return {json}                   status message
 */
async function createDeck(req, res){
    try{    
        const {Title = "Default"} = req.body;
        const User_id = "5c230d10-4e3a-4ae1-a6b1-e3063299ced6";
        const {data, error} = await supabase.from("Decks").insert([{User_id: User_id, Title: Title}]);
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(501).json({error: "Failed to create deck."});
    }
}

/**
 * @description read all decks
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @return {json}                   status message
 */
async function getAllDecks(req, res){
    try{
        const {data, error} = await supabase.from("Decks").select();
        if(error) throw error;
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(502).json({ error: "Failed to fetch decks." });
    }
}

/**
 * @description read one deck by id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          this is deck in query
 * @return {json}                   status message
 */
async function getDeck(req, res){
    try{
        const {id} = req.params;
        const {data, error} = await supabase.from("Decks").select().eq("Deck_id", id);
        if(error) throw error;
        res.json(data[0]);
    }catch(err){
        console.log(err.message);
        res.status(502).json({error: `Failed to fetch deck ${req.params.Deck_id}`});
    }
}

/**
 * @description update deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          this is deck in query
 * @property {string} Title         this is title in query
 * @return {json}                   status message
 */
async function updateDeck(req, res) {
    try{
        const {id} = req.params;
        const {Title = "Default"} = req.body;
        const { data, error } = await supabase.from("Decks").update({ Title: Title }).eq("Deck_id", [id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to update deck ${req.params.Deck_id}`});
    }
}

/**
 * @description delete deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {string} Deck_id       this is user in query
 * @return {json}                   status message
 */
async function deleteDeck(req, res){
    try{
        const {id} = req.params;
        const {data, error} = await supabase.from("Decks").delete().eq("Deck_id", [id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to delete deck ${req.params.id}`});
    }
}

async function getCardCount(req, res) {
    try {
        const { id } = req.params; 

        const { data: deckData, error: deckError } = await supabase
            .from('Decks')
            .select('Deck_id, Title')
            .eq('Deck_id', id); 
        
        if (deckError) throw deckError;  // Handle errors for deck fetching
        if (deckData.length === 0) {
            return res.status(404).json({ error: 'Deck not found' });
        }
        
        const { count: cardCount, error: cardError } = await supabase
            .from('Cards')
            .select('Card_id', { count: 'exact' })  
            .eq('Deck_id', id); 
        
        if (cardError) throw cardError;  // Handle errors for counting cards

        // Send back the result
        res.json({
            Deck_id: deckData[0].Deck_id,
            Title: deckData[0].Title,
            card_count: cardCount || 0  // If no cards found, return 0
        });

    } catch (err) {
        console.log(err.message);
        res.status(502).json({ error: 'Failed to fetch card counts for the deck.' });
    }
}


module.exports = {
    createDeck,
    getAllDecks,
    getDeck,
    updateDeck,
    deleteDeck,
    getCardCount
}