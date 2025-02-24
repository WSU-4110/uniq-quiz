const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log("Server running on port 3000");
// })

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
        res.json(aUser);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aUser);
    }
}

//update a user
async function updateUser(req, res) {
    try {
        const {id} = req.params;
        const{Username, Games_Played, Wins, Total_Score, Highest_Score, HighestScoreId} = req.body;

        const newData = {};
        if (Username) newData.Username = Username;
        if (Games_Played) newData.Games_Played = Games_Played;
        if (Wins) newData.Wins = Wins;
        if (Total_Score) newData.Total_Score = Total_Score;
        if (Highest_Score) newData.Highest_Score = Highest_Score;
        if (HighestScoreId) newData.Highest_Score_id = HighestScoreId;

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


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};