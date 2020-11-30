const express = require("express");
const router = express.Router();
const Game = require("../models/games");

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
  console.log("the body", req.body);
  const { userA, userB, userC, userD } = req.body;
  let userIds = [userA, userB, userC, userD];
  // let userIds = req.params.split(",");
  console.log("The user ids gotten from the URL:", userIds)
  Game.create(userIds)
    .then(({ gameId }) => {
      console.log("Game created. Game ID: ", gameId)
    })
    .catch((error) => {
      response.json({ error });
    });
})

router.get("/join/:id", (request, response) => {
  const { id: gameId } = request.params;

  Game.addUser(gameId, 36).then((_) => {
    response.redirect(`/games/${gameId}`);
  });
});

module.exports = router;
