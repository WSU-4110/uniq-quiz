const express = require("express");
const app = express();
const cors = require("cors"); //middleware
const env = require("dotenv").config(); //store environmental variables
const supabase = require("../supabase"); //import supabase client

//middleware
app.use(cors());
app.use(express.json()); //req.body

//create group membership
async function createGroupMembership(req, res){
    try {
        const {Group_id, User_id} = req.body;

        //Log received info
        console.log(req.body);
        console.log("Received data: ", {Group_id, User_id});

        const {data: checkMembership, error: checkError} = await supabase.from("Group_Membership").select('*').eq("Group_id", Group_id).eq("User_id", User_id);
        if(checkMembership !== null){
            res.json({"Error: user already in group": checkError});
        }
        const {data, error} = await supabase.from("Group_Membership").insert([{Group_id: Group_id, User_id: User_id}]);

        if (error){
            console.log("Database error: ", error); //Log detailed database error
        }
        res.status(201).json(data);
    } catch (err) {
        console.log(err.message);
    }
}

//get all group memberships
async function getAllGroupMemberships(req, res){
    try {
        const{data: AllGroupMems, error} = await supabase.from("Group_Membership").select('*');
        console.log(AllGroupMems);
        res.json(AllGroupMems);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllGroupMems);
    }
}

//get all users in a group
async function getGroupByGroupId(req, res){
    try {
        const {id} = req.params;
        const {data: aGroupMem, error} = await supabase.from("Group_Membership").select('*').eq("Group_id", id);
        console.log(aGroupMem);
        res.status(201).json(aGroupMem);
    } catch (err) {
        console.log(err.message);
    }
}

//get all groups that one user is in
async function getGroupByMemberId(req, res){
    try {
        const {id} = req.params;
        const {data: aGroupMem, error} = await supabase.from("Group_Membership").select('*').eq("User_id", id);
        console.log("Group by member:", aGroupMem);
        res.status(201).json(aGroupMem);
    } catch (err) {
        console.log(err.message);
    }
}

//get a single instance of a group membership
async function getGroupMembership(req, res){
    try {
        const {Group_id, User_id} = req.body;
        const {data: aGroupMem, error} = await supabase.from("Group_Membership").select('*').eq("Group_id", Group_id).eq("User_id", User_id).single();
        console.log(aGroupMem);
        res.status(201).json(aGroupMem);
    } catch (err) {
        console.log(err.message);
    }
}

//update a group membership
async function updateGroupMembership(req, res){
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
}

//delete a group
async function deleteGroupMembership(req, res){
    try {
        const {Group_id, User_id} = req.body;
        const {data: deleteMember, error} = await supabase.from("Group_Membership").delete().eq('Group_id', Group_id).eq('User_id', User_id);
        console.log("Data: ", deleteMember);
        if(error){
            console.log("Error deleting group membership: ", error);
            return res.status(400).json({message: "Error deleting group membership", error});
        }
        console.log("Group membership deleted: ", deleteMember);
        return res.status(200).json({message: "Group membership successfully deleted", deleteMember});
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    createGroupMembership,
    getAllGroupMemberships,
    getGroupByGroupId, 
    getGroupByMemberId, 
    getGroupMembership,
    updateGroupMembership,
    deleteGroupMembership
}