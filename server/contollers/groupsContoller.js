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

//create group
app.post("/Groups", async(req, res) =>{
    try {
        const {Group_id, Group_Name, Founder_id} = req.body;

        //Log received info
        console.log(req.body);
        console.log("Received data: ", {Group_id, Group_name, Founder_id});

        const {data, error} = await supabase.from("Groups").insert([{Group_id: Group_id, Group_Name: Group_Name, Founder_id: Founder_id}]);


        if (error){
            console.log("Database error: ", error); //Log detailed database error
        }
    } catch (err) {
        console.log(err.message);
        res.status(201).json(data);
    }
});

//get all groups
app.get("/Groups", async(req, res) =>{
    try {
        const{data: AllGroups, error} = await supabase.from("Groups").select('*');
        console.log(AllGroups);
        res.json(AllGroups);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllGroups);
    }
});

//get a group
app.get("/Groups/:id", async(req, res) =>{
    try {
        const{id} = req.params;
        const{data: aGroup, error} = await supabase.from("Groups").select('*').eq("Group_id", id).single();
        console.log(aGroup);
        res.json(aGroup);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aGroup);
    }
});

//update a group
app.put("/Groups/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const{Group_id, Group_Name, Founder_id} = req.body;

        const newData = {};
        if (Group_id) newData.Group_id = Group_id;
        if (Group_Name) newData.Group_Name = Group_Name;
        if (Founder_id) newData.Founder_id = Founder_id;

        const {data: updatedGroup, error} = await supabase.from("Groups").update(newData).eq('Group_id', id).select("*");
        res.json(updatedGroup);
        console.log("Updated group: ", updatedGroup);

        if(error){
            console.log("Error updating group: ", error);
        }
    } catch (err) {
        console.log(err.message);
    }
});

//delete a group
app.delete("/Groups/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: deleteGroup, error} = await supabase.from("Groups").delete().eq('Group_id', id);

        if(error){
            console.log("Error deleting group: ", error);
            return res.status(400).json({message: "Error deleting group", error});
        }
        console.log("Group deleted: ", deleteUser);
        return res.status(200).json({message: "Group successfully deleted", deleteUser});
    } catch (err) {
        console.log(err.message);
    }
});