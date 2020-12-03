const express = require("express");
const router = express.Router();
const db = require("../db"); 
const RANKINGS = "SELECT username, avatar, scores FROM users ORDER BY scores DESC LIMIT 10";

let add_user = require('../services/gq.js'); 

// /lobby  - endpoint 

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
    db.any(RANKINGS)
    .then(users =>{
        res.render("lobby", {
            users: users,
            messages: messages
        }); 
    }); 
});

router.post("/", async (req, res) => {
    const { user_id } = req.body;

    let q_status = await add_user(user_id); 
    console.log('status', q_status); 

    if (q_status === 'success') {
      res.json({
        status: 'success'
      }); 
    } else {
      console.log('fuck'); 
      res.json({
        status: 'error'
      }); 
    }

    // if (q_status.status === 'added') {
  
    //   console.log('added player to queue');     
    //   res.json({
    //     status: 'success', 
    //     msg: 'added to queue'
    //   });
      
    // } else {
  
    //   Game.create(q_status.players)
    //   .then((gameId) => {
    //     console.log("Game created. Game ID: ", gameId)
    //     res.json({
    //       status: 'success',
    //     }); 
    //   })
    //   .catch((error) => {
    //     console.log(error); 
    //     console.log('getting some sorrt of error'); 
    //     res.json({
    //       status: 'error', 
    //       error: error
    //     });
    //   });
    // }
});


module.exports = router;




