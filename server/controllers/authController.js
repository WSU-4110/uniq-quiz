const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

//middleware
app.use(cors());
app.use(express.json()); //req.body


//Signup functions
async function signUp(req, res){
    try {
        const {email, password, display_name} = req.body;
        console.log(`Email: ${email}, Password: ${password}, displayName: ${display_name}`);
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

        //Store token as HTTP cookie
        res.cookie("session_token", data.session.access_token, {
            httpOnly: true,      // Prevents JavaScript access (XSS protection)
            secure: false,        // Ensures cookie is only sent over HTTPS
            sameSite: "Strict",  // Prevents CSRF attacks
            maxAge: 60 * 60 * 1000 * 168 // 1 week expiry
        });
        res.json({data, error});
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

  //
  module.exports = {
    signUp,
    logIn,
    signOut
  }