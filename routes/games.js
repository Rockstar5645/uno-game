const { response } = require("express");
const express = require("express");
const router = express.Router();
const helper = require("../helpers/games");

let { game_board_init } = require("../services/game_board");

// /games  - endpoint
router.get("/stage", (req, res) => {
  res.render("game_stage", {});
});

router.route("/test").get(helper.testGame);

// CAUTION: the order of these routes matter
// router.route("/:game_id")
//   .get(helper.startGame)

router.get("/:game_id", async (req, res) => {
  let { game_id } = req.params;
  let { user_id } = req.cookies;

  res.render("game_board");
});

router.get("/test/:game_id", async (req, res) => {
  let { game_id } = req.params;
  let { user_id } = req.cookies;

  let player_data = await game_board_init(game_id, user_id);

  if (player_data.status === "success") {
    response.redirect(`/games/${gameId}`);
    res.render("game_board", { game_id, ...player_data.res });
  } else {
    throw Error("something went wrong");
  }
});

router.post("/:game_id/playCard", (request, response) => {
  const { card } = request.body;
  const { user_id } = request.cookies;
  const io = request.app.get("io");

  console.log(card, user_id);

  response.json({ ok: true });

  io.emit("GAME_STATE_UPDATED", { card, user_id });
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
