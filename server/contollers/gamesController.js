const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port 3000");
})

//middleware
app.use(cors());
app.use(express.json()); //req.body

//create game
app.post("/Games", async (req, res) => {
    try {
        const {Game_id, Host_id, Player_id } = req.body;
        console.log(req.body);

        // Log incoming data from Postman
        console.log("Received data:", { Game_id, Host_id, Player_id});

        const { data, error } = await supabase.from("Games").insert([{ Game_id: Game_id, Host_id: Host_id, Player_id: Player_id}]);
        res.json(data);
        
        // Log the database response
        if (error) {
            console.error("Database error:", error);  // Log detailed database error
        }
    } catch (err) {
        console.error("Caught error:", err);  // Log other errors
        res.status(201).json(data);
    }
});

//get all games
app.get("/Games", async (req, res) => {
    try {
        const {data: AllGames, error} = await supabase.from("Games").select('*');
        console.log(AllGames);
        res.json(AllGames);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllGames);
    }
});

//get a game
app.get("/Games/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: aGame, error}  = await supabase.from("Games").select('*').eq('Game_id', id).single();
        console.log(aGame);
        res.json(aGame);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aGame);
    }
});

//update a game
app.put("/Games/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const{Game_id, Host_id, Player_id} = req.body;

        const newData = {};
        if (Game_id) newData.Game_id = Game_id;
        if (Host_id) newData.Host_id = Host_id;
        if (Player_id) newData.Player_id = Player_id;

        const {data: updatedGame, error} = await supabase.from("Games").update(newData).eq('Game_id', id).select("*");
        res.json(updatedGame);
        console.log("Updated user: ", updatedGame);

        if(error){
            console.log("Error updating user: ", error);
        }

    } catch (err) {
        console.log(err.message);
    }
});

//delete a game
app.delete("/Games/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: deleteGame, error} = await supabase.from("Games").delete().eq('Game_id', id);

        if(error){
            console.log("Error deleting game: ", error);
            return res.status(400).json({message: "Error deleting game", error});
        }
        console.log("Game deleted: ", deleteGame);
        return res.status(200).json({message: "Game successfully deleted", deleteGame});
    } catch (err) {
        console.log(err.message);
    }
});

