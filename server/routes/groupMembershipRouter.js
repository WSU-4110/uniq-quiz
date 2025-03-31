const express = require("express");
const router = express.Router();

//Import controller functions
const {createGroupMembership, getAllGroupMemberships, getGroupMembership, updateGroupMembership, deleteGroupMembership} = require("../controllers/groupMembershipController");

//Create a new group membership
router.post("/", createGroupMembership);

//Get all group membership
router.get("/", getAllGroupMemberships);

//Get a single group membership via Group_id
router.get("/:id", getGroupMembership);

//Update a user group membership Group_id
router.put("/:id", updateGroupMembership);

//Delete a group membership
router.delete("/", deleteGroupMembership);

//Export router to be used in main 
module.exports = router;