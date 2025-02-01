const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}.`)
});

//connect to supabase
const supabaseURL = process.env.DATABASE_URL;
const supabaseKey = process.env.DATABASE_KEY;
const supabase = require("@supabase/supabase-js").createClient(supabaseURL, supabaseKey);

//middleware
app.use(cors());
app.use(express.json()); //req.body

/**
 * create deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {string} User_id       this is user in query
 * @property {string} Title         this is title in query
 * @return {json}                   status message
 */
app.post("/Decks", async(req, res) => {
    try{    
        const {Title = "Default"} = req.body;
        const User_id = "5c230d10-4e3a-4ae1-a6b1-e3063299ced6";
        const {data, error} = await supabase.from("Decks").insert([{User_id: User_id, Title: Title}]);
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(501).json({error: "Failed to create deck."});
    }
})

/**
 * @description read all decks
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @return {json}                   status message
 */
app.get("/Decks", async(req, res)=>{
    try{
        const {data, error} = await supabase.from("Decks").select();
        if(error) throw error;
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(502).json({ error: "Failed to fetch decks." });
    }
})

/**
 * @description read one deck by id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          this is deck in query
 * @return {json}                   status message
 */
app.get("/Decks/:Deck_id", async(req, res)=>{
    try{
        const {Deck_id} = req.params;
        const {data, error} = await supabase.from("Decks").select().eq("Deck_id", [Deck_id]);
        if(error) throw error;
        res.json(data[0]);
    }catch(err){
        console.log(err.message);
        res.status(502).json({error: `Failed to fetch deck ${req.params.Deck_id}`});
    }
})

/**
 * @description update deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          this is deck in query
 * @property {string} Title         this is title in query
 * @return {json}                   status message
 */
app.put("/Decks/:Deck_id", async(req, res)=>{
    try{
        const {Deck_id} = req.params;
        const {Title = "Default"} = req.body;
        const { data, error } = await supabase.from("Decks").update({ Title: Title }).eq("Deck_id", [Deck_id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to update deck ${req.params.Deck_id}`});
    }
})

/**
 * @description delete deck
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {string} Deck_id       this is user in query
 * @return {json}                   status message
 */

app.delete("/Decks/:Deck_id", async(req, res)=>{
    try{
        const {Deck_id} = req.params;
        const {data, error} = await supabase.from("Decks").delete().eq("Deck_id", [Deck_id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to delete deck ${req.params.Deck_id}`});
    }
})