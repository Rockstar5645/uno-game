const express = require("express");
const router = express.Router();
const Game = require("../db/games");

router.get("/:id", (request, response) => {
  const { id: gameId } = request.params;

  Game.getGameInfo(gameId)
    .then(({ id, createdAt, users, deck }) => {
      response.render("games", { id, createdAt, users, deck });
    })
    .catch((error) => {
      response.json({ error });
    });
});

router.get("/join/:id", (request, response) => {
  const { id: gameId } = request.params;

  Game.addUser(gameId, 36).then((_) => {
    response.redirect(`/games/${gameId}`);
  });
});

module.exports = router;
