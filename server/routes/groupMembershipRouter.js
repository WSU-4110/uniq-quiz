const express = require("express");
const router = express.Router();

//Import controller functions
const {createGroupMembership, getAllGroupMemberships, getGroupByGroupId, getGroupByMemberId, getGroupMembership, updateGroupMembership, deleteGroupMembership} = require("../controllers/groupMembershipController");

//Create a new group membership
router.post("/", createGroupMembership);

//Get all group membership
router.get("/", getAllGroupMemberships);

//Get all members from a group
router.get("/group/:id", getGroupByGroupId);

//Get all groups of a member
router.get("/member/:id", getGroupByMemberId);

//Get a single instance of a group membership
router.get("/membership", getGroupMembership);

//Update a user group membership Group_id
router.put("/:id", updateGroupMembership);

//Delete a group membership
router.delete("/", deleteGroupMembership);

//Export router to be used in main 
module.exports = router;