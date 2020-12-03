const express = require("express");
const router = express.Router();

// /games  - endpoint 

// simple route to test the game_board.pug
router.get("/", (request, response) => {
  // const { id: gameId } = request.params;
  response.render("game_board", {});
});

router.get('/stage', (req, res) => {

  res.render('game_stage', {}); 
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


router.get("/join/:id", (request, response) => {
  const { id: gameId } = request.params;

  Game.addUser(gameId, 36).then((_) => {
    response.redirect(`/games/${gameId}`);
  });
});

module.exports = router;
