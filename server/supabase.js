const env = require("dotenv").config(); //store environmental variables
const {createClient} = require('@supabase/supabase-js');

//Get URL and API Key from .env file
const supabaseURL = process.env.DATABASE_URL;
const supabaseKey = process.env.DATABASE_KEY;

//create supabase client
const supabase = createClient(supabaseURL, supabaseKey);

//export client
module.exports = supabase;