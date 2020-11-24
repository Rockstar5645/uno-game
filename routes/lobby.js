const express = require("express");
const router = express.Router();
const Game = require("../db/games");

router.get("/", function (request, response, next) {
  Game.getLobbyListing()
    .then((games) => {
      response.render("lobby", { games });
    })
    .catch((error) => {
      response.render("lobby", { games: [] });
    });
});



module.exports = router;
