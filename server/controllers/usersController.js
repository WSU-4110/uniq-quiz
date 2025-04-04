const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client
const {jwtDecode} = require("jwt-decode"); //Needed for decoding a session token

//middleware
app.use(cors());
app.use(express.json()); //req.body

//create user - Should not be used outside testing. User creation happens through Auth Signup.
async function createUser(req, res) {
    try {
        const { Username} = req.body;
        console.log(req.body);

        // Log incoming data from Postman
        console.log("Received data:", { Username, Password, Email});

        const { data, error } = await supabase.from("Users").insert([{ Username: Username, Password: Password, Email: Email}]);
        res.json(data);
        
        // Log the database response
        if (error) {
            console.error("Database error:", error);  // Log detailed database error
        }
    } catch (err) {
        console.error("Caught error:", err);  // Log other errors
        res.status(201).json(data);
    }
}

//get all users
async function getAllUsers(req, res) {
    try {
        const {data: AllUsers, error} = await supabase.from("Users").select('*');
        console.log(AllUsers);
        res.json(AllUsers);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllUsers);
    }
}

//get a user
async function getUser(req, res) {
    try {
        const {id} = req.params;
        const {data: aUser, error}  = await supabase.from("Users").select('*').eq('User_id', id).single();
        console.log(aUser);
        res.status(201).json(aUser);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Error selecting user" });
    }
}

//get users by ID array
async function getUsersById(req, res){
    try{
        const { User_Ids } = req.body; 
        console.log("User Ids:", User_Ids);
        const {data, error} = await supabase.from("Users").select().in("User_id", User_Ids);
        res.status(201).json(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Error selecting user" });
    }
}

//update a user
async function updateUser(req, res) {
    try {
        const {id} = req.params;
        const{Username, Games_Played, Wins, Total_Score, Highest_Score, Highest_Score_id} = req.body;

        const newData = {};
        if (Username) newData.Username = Username;
        if (Games_Played) newData.Games_Played = Games_Played;
        if (Wins) newData.Wins = Wins;
        if (Total_Score) newData.Total_Score = Total_Score;
        if (Highest_Score) newData.Highest_Score = Highest_Score;
        if (Highest_Score_id) newData.Highest_Score_id = Highest_Score_id;

        const {data: updatedUser, error} = await supabase.from("Users").update(newData).eq('User_id', id).select("*");
        res.json(updatedUser);
        console.log("Updated user: ", updatedUser);

        if(error){
            console.log("Error updating user: ", error);
        }

    } catch (err) {
        console.log(err.message);
    }
}

//delete a user
async function deleteUser(req, res){
    try {
        const {id} = req.params;
        const {data: deleteUser, error} = await supabase.from("Users").delete().eq('User_id', id);

        if(error){
            console.log("Error deleting user: ", error);
            return res.status(400).json({message: "Error deleting user", error});
        }
        console.log("User deleted: ", deleteUser);
        return res.status(200).json({message: "User successfully deleted", deleteUser});
    } catch (err) {
        console.log(err.message);
    }
}

//set user profile privacy
async function setUserPrivacy(req, res){
    try{
        const {id} = req.params;
        const {privacy} = req.body;
        const{data, error} = await supabase.from("Users").update({Private: privacy}).eq('User_id', id);
        if(error){
            console.log("Error setting user to private: ", error.message);
            return res.status(400).json({error: error.message});
        }

        return res.status(200).json({message: `User privacy set to ${privacy}`})
    }
    catch(err){
        console.log(err.message);
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUsersById,
    updateUser,
    deleteUser,
    setUserPrivacy
};