const {createClient} = require('@supabase/supabase-js');
const env = require("dotenv").config(); //store environmental variables


//Get URL and API Key from .env file
const supabaseURL = process.env.DATABASE_URL;
const supabaseKey = process.env.DATABASE_KEY;

//create supabase client
const supabase = createClient(supabaseURL, supabaseKey);

(async () => {
    const { data, error } = await supabase.from('Decks').select('*').limit(1);
    console.log("Supabase test:", data || error);
  })();

//export client
module.exports = supabase;