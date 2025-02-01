const express = require("express");
const router = express.Router();

//Import controller functions
const {createGroup, getAllGroups, getGroup, updateGroup, deleteGroup} = require("../controllers/groupsController");

//Create a new group
router.post("/", createGroup);

//Get all groups
router.get("/", getAllGroups);

//Get a single group via User_id
router.get("/:id", getGroup);

//Update a group via User_id
router.put("/:id", updateGroup);

//Delete a group via User_id
router.delete("/:id", deleteGroup);

//Export router to be used in main 
module.exports = router;