const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables

//connect to supabase
const supabaseURL = process.env.DATABASE_URL;
const supabaseKey = process.env.DATABASE_KEY;
const supabase = require("@supabase/supabase-js").createClient(supabaseURL, supabaseKey);

//middleware
app.use(cors());
app.use(express.json()); //req.body