const express = require("express");
const router = express.Router();
const Game = require("../models/games");
let add_user = require('../services/gq.js'); 

// simple route to test the game_board.pug
router.get("/", (request, response) => {
  // const { id: gameId } = request.params;
  response.render("game_board", {});
});

// router.get("/:id", (request, response) => {
//   const { id: gameId } = request.params;

//   Game.getGameInfo(gameId)
//     .then(({ id, createdAt, users, deck }) => {
//       response.render("games", { id, createdAt, users, deck });
//     })
//     .catch((error) => {
//       response.json({ error });
//     });
// });

router.post("/", (req, res) => {
  console.log("the user_id received: ", req.body);
  const { user_id } = req.body;
 
  let q_status = add_user(user_id); 
  console.log(q_status); 
  if (q_status.status === 'added') {

    //res.redirect('/games'); 
    console.log('executing this');     
    res.json({
      status: 'success', 
      msg: 'added to queue'
    }); 
    
  } else {

    Game.create(q_status.players)
    .then((gameId) => {
      console.log("Game created. Game ID: ", gameId)
      res.json({
        status: 'success',
        gameId: gameId
      }); 
    })
    .catch((error) => {
      console.log(error); 
      console.log('getting some sorrt of error'); 
      res.json({
        status: 'error', 
        error: error
      });
    });
  }

  
})

router.get("/join/:id", (request, response) => {
  const { id: gameId } = request.params;

  Game.addUser(gameId, 36).then((_) => {
    response.redirect(`/games/${gameId}`);
  });
});

module.exports = router;
