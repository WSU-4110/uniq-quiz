const {createClient} = require('@supabase/supabase-js');
const env = require("dotenv").config(); //store environmental variables


//Get URL and API Key from .env file
const supabaseURL = process.env.DATABASE_URL;
const supabaseAdminKey = process.env.DATABASE_SERVICE_ROLE_KEY;

//create supabase client
const supabaseAdmin = createClient(supabaseURL, supabaseAdminKey);

//export client
module.exports = supabaseAdmin;