const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

//middleware
app.use(cors());
app.use(express.json()); //req.body

function generateJoinCode(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

//create game
async function createGame(req,res){
    try {
        const {Host_id} = req.body;
        console.log(req.body);

        // Log incoming data from Postman
        console.log("Received data:", { Host_id});
        const Join_Code = generateJoinCode();
        console.log("Generated code: ", Join_Code);

        const { data, error } = await supabase.from("Games").insert([{Host_id: Host_id, Join_Code: Join_Code}]).select();
        res.status(201).json({message: "Game created successfully", data});
        
        // Log the database response
        if (error) {
            console.error("Database error:", error);  // Log detailed database error
        }
    } catch (err) {
        console.error("Caught error:", err);  // Log other errors
        res.status(201).json(data);
    }
}

//get all games
async function getAllGames(req, res){
    try {
        const {data: AllGames, error} = await supabase.from("Games").select('*');
        console.log(AllGames);
        res.json(AllGames);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllGames);
    }
}

//get a game by game id
async function getGameByGameId(req, res){
    try {
        const {id} = req.params;
        const {data: aGame, error}  = await supabase.from("Games").select('*').eq('Game_id', id).single();
        console.log(aGame);
        res.json(aGame);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aGame);
    }
}

//get a game by join code
async function getGameByJoinCode(req, res){
    try{
        const {Join_Code} = req.params;
        console.log(Join_Code);
        const {data: aGame, error} = await supabase.from("Games").select('*').eq('Join_Code', Join_Code).single();
        console.log(aGame);
        res.json(aGame);
    } catch(err) {
        console.log(err.message);
        res.status(201).json(aGame);
    }
}

//update a game
async function updateGame(req, res){
    try {
        const {id} = req.params;
        const{Game_id, Host_id, Player_id} = req.body;

        const newData = {};
        if (Game_id) newData.Game_id = Game_id;
        if (Host_id) newData.Host_id = Host_id;
        if (Player_id) newData.Player_id = Player_id;

        const {data: updatedGame, error} = await supabase.from("Games").update(newData).eq('Game_id', id).select("*");
        res.json(updatedGame);
        console.log("Updated user: ", updatedGame);

        if(error){
            console.log("Error updating user: ", error);
        }

    } catch (err) {
        console.log(err.message);
    }
}

//delete a game
async function deleteGame(req, res){
    try {
        const {id} = req.params;
        const {data: deleteGame, error} = await supabase.from("Games").delete().eq('Game_id', id);

        if(error){
            console.log("Error deleting game: ", error);
            return res.status(400).json({message: "Error deleting game", error});
        }
        console.log("Game deleted: ", deleteGame);
        return res.status(200).json({message: "Game successfully deleted", deleteGame});
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    createGame,
    getAllGames,
    getGameByGameId,
    getGameByJoinCode,
    updateGame,
    deleteGame
};