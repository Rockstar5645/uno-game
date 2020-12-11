const express = require("express");
const router = express.Router();
const db = require("../db");

let add_user = require('../services/gq.js');
let userService = require('../services/users');

// /lobby  - endpoint 
let Lobby = require("../models/lobby");
router.get("/", async (req, res) => {

  if (req.cookies.user_id) {
    let game_status = await userService.check_if_in_game(req.cookies.user_id);
    if (game_status.in_game === true) {
      let redirection = '/games/' + game_status.game_id;
      console.log('redirecting to:', redirection);
      res.redirect(redirection);
      return;
    }
  }
  Lobby.lobbyInfo(req)
    .then(({ users, lobbyMessages, user_id, avatar, username }) => {
      res.render("lobby", {
        user_id: user_id,
        avatar: avatar,
        username: username,
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




