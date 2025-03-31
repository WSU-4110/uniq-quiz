const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client


//middleware
app.use(cors());
app.use(express.json()); //req.body

//create group
async function createGroup(req, res) {
    try {
        const {Group_Name, Founder_id} = req.body;
        const {data, error} = await supabase.from("Groups").insert([{Group_Name: Group_Name, Founder_id: Founder_id}]).select();

        if (error){
            console.log("Database error: ", error); //Log detailed database error
        }

        console.log("Inserted group:", data);

        //Insert new user as member in group
        const {data: insertData, error: insertError} = await supabase.from("Group_Membership").insert([{Group_id: data[0].Group_id, User_id: Founder_id}]);

        if (insertError){
            console.log("Database error: ", error);
        }

        res.status(201).json(data);
    } catch (err) {
        console.log(err.message);
    }
}

//get all groups
async function getAllGroups(req, res) {
    try {
        const{data: AllGroups, error} = await supabase.from("Groups").select('*');
        console.log(AllGroups);
        res.status(201).json(AllGroups);
    } catch (err) {
        console.log(err.message);
    }
}

//get a group
async function getGroup(req, res){
    try {
        const{id} = req.params;
        const{data: aGroup, error} = await supabase.from("Groups").select('*').eq("Group_id", id).single();
        console.log(aGroup);
        res.status(201).json(aGroup);
    } catch (err) {
        console.log(err.message);
    }
}

//update a group
async function updateGroup(req, res){
    try {
        const {id} = req.params;
        const{Group_Name, Founder_id} = req.body;

        const newData = {};
        if (Group_Name) newData.Group_Name = Group_Name;
        if (Founder_id) newData.Founder_id = Founder_id;

        const {data: updatedGroup, error} = await supabase.from("Groups").update(newData).eq('Group_id', id).select("*");
        if(error){
            console.log("Error updating group: ", error);
        }
        res.status(201).json(updatedGroup);
        console.log("Updated group: ", updatedGroup);
    } catch (err) {
        console.log(err.message);
    }
}

//delete a group
async function deleteGroup(req, res){
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
}

module.exports = {
    createGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup
}