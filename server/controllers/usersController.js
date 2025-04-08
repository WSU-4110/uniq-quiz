const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client
const {jwtDecode} = require("jwt-decode"); //Needed for decoding a session token

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
        const{Username, Password, Email} = req.body;

        const newData = {};
        if (Username) newData.Username = Username;
        if (Password) newData.Password = Password;
        if (Email) newData.Email = Email;

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

//changes user's username
async function updateUsername(req, res) {
    try {
        const { id } = req.params; // user_id from URL
        const { Username } = req.body;

        // Validation
        const trimmedUsername = Username?.trim();
        if (!trimmedUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username cannot be empty'
            });
        }

        if (trimmedUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            });
        }

        // Check for existing username (excluding current user)
        const { data: existingUser, error: lookupError } = await supabase
            .from('Users')
            .select('user_id')
            .eq('Username', trimmedUsername)
            .neq('user_id', id);

        if (lookupError) throw lookupError;
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Update username
        const { data, error } = await supabase
            .from('Users')
            .update({ username: trimmedUsername })
            .eq('user_id', id)
            .select();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: 'Username updated successfully',
            user: data[0]
        });

    } catch (err) {
        console.error('Username update error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    setUserPrivacy,
    updateUsername
};