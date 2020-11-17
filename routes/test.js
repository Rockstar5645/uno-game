const express = require("express");
const router = express.Router();
const db = require("../db");
const Game = require("../db/games");
const faker = require("faker");

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
    db.one(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id",
      [faker.internet.email(), faker.name.findName(), faker.internet.password()]
    ),
    db.one(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id",
      [faker.internet.email(), faker.name.findName(), faker.internet.password()]
    ),
  ])
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
