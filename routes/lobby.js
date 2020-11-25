const express = require("express");
const router = express.Router();
const Game = require("../db/games");

router.get("/", function (req, res, next) {
  console.log('got a request for user with id: ' + req.mySession.user_id);
  Game.getLobbyListing()
    .then((games) => {
      res.render("lobby", { games });
    })
    .catch((error) => {
      res.render("lobby", { games: [] });
    });
});


module.exports = router;
