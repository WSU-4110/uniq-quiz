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
        const { Username } = req.body;
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

  //Delete an account
  async function deleteAccount(req, res){
    //Get session token to check if user is logged in
    const token = req.cookies['session_token'];
    if(!token){
      return res.status(401).json({error: "No token provided. Please log in first."});
    }

    //Actual deletion logic
    try {
      //Get user data
      const {data: user, error: userError} = await supabase.auth.getUser(token);
      if(userError || !user){
        return res.status(401).json({error: "Invalid or expired token. Please log in again."})
      }
      const userId = user.user.id;
      const {error: deleteError} = await supabaseAdmin.auth.admin.deleteAccount(userId);
      if(deleteError){
        return res.status(500).json({error: deleteError.message});
      }
      
      res.clearCookie('session_token');
      res.status(200).json({message: "Account deleted successfully"});
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
            .select('User_id')
            .eq('Username', trimmedUsername)
            .neq('User_id', id);

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
            .update({ Username: trimmedUsername })
            .eq('User_id', id)
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

async function updateProfilePic(req, res) {
    try {
      const userId = req.params.id;
      const file = req.file;

      console.log('userId:', userId, typeof userId);
  
      if (!file || !userId) {
        console.log('Missing file or userId');
        return res.status(400).json({ error: 'Missing file or userId' });
      }
  
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
  
      console.log('Uploading to Supabase path:', filePath);
  
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true, 
        });
  
      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ error: 'Failed to upload to Supabase' });
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
  
      const publicUrl = publicUrlData?.publicUrl;
  
      if (!publicUrl) {
        console.error('Failed to retrieve public URL');
        return res.status(500).json({ error: 'Failed to generate public URL' });
      }
  
      const { error: updateError } = await supabase
        .from('Users')
        .update({ Profile_Pic: publicUrl })
        .eq('User_id', userId);
  
      if (updateError) {
        console.error('DB update error:', updateError);
        return res.status(500).json({ error: 'Failed to update user profile' });
      }
  
      res.status(200).json({ message: 'Profile picture uploaded', url: publicUrl });
  
    } catch (err) {
      console.error('Unexpected server error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
    
  }
  

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUsersById,
    updateUser,
    deleteAccount,
    setUserPrivacy,
    updateUsername,
    updateProfilePic
};