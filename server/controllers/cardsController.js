const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

/**
 * @todo should not repeat listen command
 */
app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}.`)
});

//middleware
app.use(cors());
app.use(express.json()); //req.body


/**
 * @description create card by deck id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          html req: deck to insert into
 * @property {string} Question      question: send in json request
 * @property {string} Answer        answer: send in json request
 * @property {string} Incorrect1
 * @property {string} Incorrect2
 * @property {string} Incorrect3
 * @property {string} Image
 * @return {json}                   status message
 */
app.post("/Cards/:Deck_id", async(req, res) => {
    try{    
        const {Deck_id} = req.params;
        const {Question, Answer, Incorrect1, Incorrect2, Incorrect3, Image} = req.body;
        const {data, error} = await supabase.from("Cards").insert([{
            Deck_id: Deck_id, Question: Question, Answer: Answer, 
            Incorrect1: Incorrect1, Incorrect2: Incorrect2, Incorrect3: Incorrect3, Image: Image}]);
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(501).json({error: "Failed to create card."});
    }
})

/**
 * @description get card by deck id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          html req: deck to insert into
 * @return {json}                   status message
 */

app.get("/Cards/:Deck_id", async(req, res)=>{
    try{
        const {Deck_id} = req.params;
        const {data, error} = await supabase.from("Cards").select().eq("Deck_id", [Deck_id]);
        if(error) throw error;
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(502).json({error: `Failed to fetch deck ${req.params.Deck_id}`});
    }
})

/**
 * @description update card by card id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Deck_id          html req: deck to update
 * @property {int} Card_id          html req: card to update
 * @return {json}                   status message
 * 
 */
app.put("/Cards/:Card_id", async(req, res)=>{
    try{
        const {Card_id} = req.params;
        const {Deck_id} = await supabase.from("Cards").select().eq("Card_id", [Card_id]);
        const {Question, Answer, Incorrect1, Incorrect2, Incorrect3, Image} = req.body;
        const { data, error } = await supabase.from("Cards").update([{
            Deck_id: Deck_id, Question: Question, Answer: Answer, 
            Incorrect1: Incorrect1, Incorrect2: Incorrect2, Incorrect3: Incorrect3, Image: Image}])
            .eq("Card_id", [Card_id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to update card ${req.params.Card_id}`});
    }
})

/**
 * @description delete card by card id
 * @param {express.Request} req     request
 * @param {express.Response} res    response
 * @property {int} Card_id          html req: card to delete
 * @return {json}                   status message
 * 
 */
app.delete("/Cards/:Card_id", async(req, res)=>{
    try{
        const {Card_id} = req.params;
        const {data, error} = await supabase.from("Cards").delete().eq("Card_id", [Card_id]).select();
        res.json(data);
    }catch(error){
        console.log(error.message);
        res.status(502).json({error: `Failed to delete card ${req.params.Card_id}`});
    }
})
