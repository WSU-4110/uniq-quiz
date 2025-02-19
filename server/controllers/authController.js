const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client
const supabaseAdmin = require("../supabaseAdmin"); //Import admin supabase client

//middleware
app.use(cors());
app.use(express.json()); //req.body


//Signup functions
async function signUp(req, res){
    try {
        //Create user in Auth table
        const {email, password, display_name} = req.body;
        console.log(`Email: ${email}, Password: ${password}, display_name: ${display_name}`);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                display_name: display_name,
              }
            }
        })
        console.log("Error:", error);

        if(error){
          return res.status(400).json({ error: error.message });
        }

        //Extract user ID from data for use in Users table
        const userId = data.user?.id

        //Insert new user into Users table
        console.log("User_id:", userId, "Email:", email)
        const {error: insertError} = await supabase.from("Users").insert({User_id: userId, Username: email, Profile_Pic: "NullForNow"});
        if(insertError){
          console.log("Insert error: ", insertError);
        }

        //Store token as HTTP cookie
        res.cookie("session_token", data.session.access_token, {
            httpOnly: true,      // Prevents JavaScript access (XSS protection)
            secure: false,        // Ensures cookie is only sent over HTTPS
            sameSite: "Strict",  // Prevents CSRF attacks
            maxAge: 60 * 60 * 1000 * 168 // 1 week expiry
        });
        res.json({message: "Signup successful", data, error});
        }catch(err){
            console.log(err.message);
        }
    }

  //Login function
  async function logIn(req, res){
    try {
        const {email, password} = req.body;
        console.log(`Email: ${email}, Password: ${password}`);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if(error){
          console.log("Login error: ", error.message);
          return res.status(400)/json({error: error.message});
        }

        //Store token as HTTP cookie
        res.cookie("session_token", data.session.access_token, {
            httpOnly: true,      // Prevents JavaScript access (XSS protection)
            secure: false,        // Ensures cookie is only sent over HTTPS
            sameSite: "Strict",  // Prevents CSRF attacks
            maxAge: 60 * 60 * 1000 * 168 // 1 week expiry
        });
        res.json({data, error});
    } catch (err) {
        console.log(err.message);
    }
  }

  //Signout function
  async function signOut(req, res){
    //Check to make sure user is signed in before signing out
    const token = req.cookies['session_token'];
    if(!token){
      return res.status(401).json({error: "No token provided. Please log in first."});
    }

    //Actual sign out logic
    try {
      const {data: session, error: sessionError} = await supabase.auth.getSession();
      if(sessionError || !session){
        return res.status(401).json({error: "Invalid or expired token. Please log in again."})
      }

      const {error: signOutError} = await supabase.auth.signOut();
      if(signOutError){
        return res.status(500).json({error: "Failed to sign out."});
      }
      res.clearCookie("session_token");

      return res.status(200).json({ message: 'Signed out successfully' });

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
      const {error: deleteError} = await supabaseAdmin.auth.admin.deleteUser(userId);
      if(deleteError){
        return res.status(500).json({error: deleteError.message});
      }
      
      res.clearCookie('session_token');
      res.status(200).json({message: "Account deleted successfully"});
    } catch (err) {
      console.log(err.message);
    }
  }

  //Get displayname
  async function getDisplayName(req, res){
    //Get session token
    const token = req.cookies['session_token'];
    if(!token){
      return res.status(401).json({error: "No token provided. Please log in first."});
    }

    try {
      //Get user data
      const {data: user, error: userError} = await supabase.auth.getUser(token);
      if(userError || !user){
        return res.status(401).json({error: "Invalid or expired token. Please log in again."})
      }

      const displayName = user.user.user_metadata?.display_name || "No display name set";
      if(!displayName){
        return res.status(401).json({error: "User or display name not found"});
      }

      return res.status(200).json({display_name: displayName});

    } catch (error) {
      console.log(error.message);
    }
  }

  //
  module.exports = {
    signUp,
    logIn,
    signOut,
    deleteAccount,
    getDisplayName
  }