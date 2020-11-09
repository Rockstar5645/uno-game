const express = require("express");
const router = express.Router();
const db = require("../db");
const Game = require("../db/games");

router.get("/", (request, response) => {
  db.any(
    `INSERT INTO test_table ("testString") VALUES ('Hello at ${Date.now()}')`
  )
    .then((_) => db.any(`SELECT * FROM test_table`))
    .then((results) => response.json(results))
    .catch((error) => {
      console.log(error);
      response.json({ error });
    });
});

router.get("/populatedb", (request, response) => {
  Promise.all([
    db.any("DELETE FROM game_deck WHERE 1=1"),
    db.any("DELETE FROM game_users WHERE 1=1"),
    db.any("DELETE FROM games WHERE 1=1"),
    db.any("DELETE FROM users WHERE 1=1"),
  ])
    .then(() =>
      Promise.all([
        db.one(
          "INSERT INTO users (email, username, password) VALUES ('jrob@sfsu.edu', 'jrob', 'password') RETURNING id"
        ),
        db.one(
          "INSERT INTO users (email, username, password) VALUES ('katie@sfsu.edu', 'katie', 'password') RETURNING id"
        ),
      ])
    )
    .then(([userOneId, userTwoId]) =>
      Promise.all([Game.create(userOneId.id), userTwoId.id])
    )
    .then(([gameId, userTwoId]) =>
      Promise.all([Game.addUser(gameId, userTwoId), gameId])
    )
    .then(([_, gameId]) => {
      console.log("Redirecting", gameId);
      response.redirect(`/games/${gameId}`);
    });
});

module.exports = router;
