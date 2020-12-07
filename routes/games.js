const express = require("express");
const router = express.Router();
const helper = require('../helpers/games');

// /games  - endpoint 
router.get('/stage', (req, res) => {
  res.render('game_stage', {});
});

router.route("/test")
  .get(helper.testGame)

// CAUTION: the order of these routes matter
router.route("/:game_id")
  .get(helper.startGame)

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
