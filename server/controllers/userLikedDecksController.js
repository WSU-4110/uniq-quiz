const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client
const {jwtDecode} = require("jwt-decode"); //Needed for decoding a session token
console.log("jwtDecode is: ", jwtDecode);

//Like a deck via Deck_id
async function likeDeck(req, res){
    try {
        //Must be logged in to like a deck. Retrieve User_id via session_token
        const token = req.cookies['session_token']
        if(!token){
            return res.status(401).json({message: "User not authenticated"});
        }

        //Decode token
        const decoded_token = jwtDecode(token);
        //Extract User_id
        const User_id = decoded_token.sub;
        if(!User_id){
            return res.status(401).json({message: "User_id not found in token"});
        }


        //Actual like deck logic
        const{Deck_id} = req.params;
        const {data, error} = await supabase
            .from("UserLikedDecks")
            .insert([{User_id: User_id, Deck_id: Deck_id}])
            .select();
        if(error){
            return res.status(400).json({message: "Error inserting liked deck: ", error: error});
        }

        return res.status(201).json(data);
    } catch (err) {
        console.log("Error while liking deck: ", err.message);
        return res.status(500).json(err);
    }
}

//Delete liked deck via Deck_id
async function unlikeDeck (req, res) {
    try {
        //Must be logged in to unlike a deck. Retrieve User_id via session_token
        const token = req.cookies['session_token']
        if(!token){
            return res.status(401).json({message: "User not authenticated"});
        }

        //Decode token
        const decoded_token = jwtDecode(token);
        //Extract User_id
        const User_id = decoded_token.sub;
        if(!User_id){
            return res.status(401).json({message: "User_id not found in token"});
        }


        //unlike logic
        const {Deck_id} = req.params;
        const {data, error} = await supabase
            .from("UserLikedDecks")
            .delete()
            .eq("Deck_id", Deck_id);
        
        if(error){
            console.log("Error deleting liked deck: ", error.message);
            return res.status(400).json({message: "Error deleting liked deck", error: error});
        }

        return res.status(204).json({message: "Successfully deleted liked deck."});
    } catch (err) {
        console.log("Error unliking deck: ", err.message);
        return res.status(500).json(err);
    }
}

//Get all decks a user has liked
async function getLikedDecks (req, res){
    try {
        const {User_id} = req.params;
        const {data, error} = await supabase
            .from("UserLikedDecks")
            .select("*")
            .eq("User_id", User_id);
        
        if(error){
            console.log("Error retrieving user liked decks: ", error.message);
            return res.status(400).json({message: "Error retrieving user liked decks", error: error});
        }

        return res.status(200).json(data);
    } catch (err) {
        console.log("Server error retrieving liked decks: ", err.message);
        return res.status(500).json({message: "Server error retrieving liked decks", err});
    }
}

module.exports = {
    likeDeck,
    unlikeDeck,
    getLikedDecks
}