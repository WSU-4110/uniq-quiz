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

//create group membership
app.post("/Group_Membership", async(req, res) =>{
    try {
        const {Group_id, User_id} = req.body;

        //Log received info
        console.log(req.body);
        console.log("Received data: ", {Group_id, User_id});

        const {data, error} = await supabase.from("Group_Membership").insert([{Group_id: Group_id, User_id: User_id}]);


        if (error){
            console.log("Database error: ", error); //Log detailed database error
        }
    } catch (err) {
        console.log(err.message);
        res.status(201).json(data);
    }
});

//get all group memberships
app.get("//Group_Membership", async(req, res) =>{
    try {
        const{data: AllGroupMems, error} = await supabase.from("Group_Membership").select('*');
        console.log(AllGroupMems);
        res.json(AllGroupMems);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllGroupMems);
    }
});

//get a group membership
app.get("/Group_Membership/:id", async(req, res) =>{
    try {
        const{id} = req.params;
        const{data: aGroupMem, error} = await supabase.from("Group_Membership").select('*').eq("Group_id", id).single();
        console.log(aGroupMem);
        res.json(aGroupMem);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aGroupMem);
    }
});

//update a group membership
app.put("/Group_Membership/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const{Group_id, User_id} = req.body;

        const newData = {};
        if (Group_id) newData.Group_id = Group_id;
        if (User_id) newData.User_id = User_id;

        const {data: updatedGroup, error} = await supabase.from("Group_Membership").update(newData).eq('Group_id', id).select("*");
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
app.delete("/Group_Membership/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: deleteGroup, error} = await supabase.from("Group_Membership").delete().eq('Group_id', id);

        if(error){
            console.log("Error deleting group membership: ", error);
            return res.status(400).json({message: "Error deleting group membership", error});
        }
        console.log("Group membership deleted: ", deleteUser);
        return res.status(200).json({message: "Group membership successfully deleted", deleteUser});
    } catch (err) {
        console.log(err.message);
    }
});