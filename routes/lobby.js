const express = require("express");
const router = express.Router();
const db = require("../db"); 

let add_user = require('../services/gq.js'); 

// /lobby  - endpoint 
let Lobby = require("../models/lobby");
router.get("/", (req, res) => {
    Lobby.lobbyInfo(req)
        .then(({ users, lobbyMessages, user }) => {
            res.render("lobby", {
                user_id: user.user_id,
                users: users,
                messages: lobbyMessages,
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

router.post("/", async (req, res) => {
    const { user_id } = req.body;

    let q_status = await add_user(user_id); 

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




