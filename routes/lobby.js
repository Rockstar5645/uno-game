const express = require("express");
const router = express.Router();
const db = require("../db"); 
// const RANKINGS = "SELECT username, avatar, scores FROM users ORDER BY scores DESC LIMIT 10";

// TODO - Create a table for lobby chatting.
// dummy messages
var messages = [
    {
        username: "User1",
        text: "Let's play one more"
    },
    {
        username: "User2",
        text: "Nice game"
    },
    {
        username: "TestUser3",
        text: "Hah I won again!"
    },
    {
        username: "User4",
        text: "Uno does manage to deliver the basic elements of the card game very well. Visuals are bright and cheery with an irritating ‘”elevator music” soundtrack."
    }
]

router.get("/", (req, res) => {
    res.render("lobby", {
        users: "",
        messages: messages
    });
    // db.any(RANKINGS)
    // .then(users =>{
    //     res.render("lobby", {
    //         users: users,
    //         messages: messages
    //     });
    // })
});


module.exports = router;




