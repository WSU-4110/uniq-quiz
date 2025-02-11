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
            secure: true,        // Ensures cookie is only sent over HTTPS
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

        //Store token as HTTP cookie
        res.cookie("session_token", data.session.access_token, {
            httpOnly: true,      // Prevents JavaScript access (XSS protection)
            secure: true,        // Ensures cookie is only sent over HTTPS
            sameSite: "Strict",  // Prevents CSRF attacks
            maxAge: 60 * 60 * 1000 * 168 // 1 week expiry
        });
        res.json({data, error});
    } catch (err) {
        console.log(err.message);
    }
  }

  //
  module.exports = {
    signUp,
    logIn
  }