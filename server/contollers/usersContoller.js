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

//create user
app.post("/Users", async (req, res) => {
    try {
        const { Username, Password, Email } = req.body;
        console.log(req.body);

        // Log incoming data from Postman
        console.log("Received data:", { Username, Password, Email});

        const { data, error } = await supabase.from("Users").insert([{ Username: Username, Password: Password, Email: Email}]);
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

//get all users
app.get("/Users", async (req, res) => {
    try {
        const {data: AllUsers, error} = await supabase.from("Users").select('*');
        console.log(AllUsers);
        res.json(AllUsers);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(AllUsers);
    }
});

//get a user
app.get("/Users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: aUser, error}  = await supabase.from("Users").select('*').eq('User_id', id).single();
        console.log(aUser);
        res.json(aUser);
    } catch (err) {
        console.log(err.message);
        res.status(201).json(aUser);
    }
});

//update a user
app.put("/Users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const{Username, Password, Email} = req.body;

        const newData = {};
        if (Username) newData.Username = Username;
        if (Password) newData.Password = Password;
        if (Email) newData.Email = Email;

        const {data: updatedUser, error} = await supabase.from("Users").update(newData).eq('User_id', id).select("*");
        res.json(updatedUser);
        console.log("Updated user: ", updatedUser);

        if(error){
            console.log("Error updating user: ", error);
        }

    } catch (err) {
        console.log(err.message);
    }
});

//delete a user
app.delete("/Users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {data: deleteUser, error} = await supabase.from("Users").delete().eq('User_id', id);

        if(error){
            console.log("Error deleting user: ", error);
            return res.status(400).json({message: "Error deleting user", error});
        }
        console.log("User deleted: ", deleteUser);
        return res.status(200).json({message: "User successfully deleted", deleteUser});
    } catch (err) {
        console.log(err.message);
    }
});

