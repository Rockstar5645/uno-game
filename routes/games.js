const { response } = require("express");
const express = require("express");
const router = express.Router();

const Game = require('../models/games'); 
const Cards = require('../models/cards');
const serviceCards = require('../services/cards');

let { game_board_init } = require("../services/game_board");

// /games  - endpoint

// queue staging area
router.get("/stage", (req, res) => {
  res.render("game_stage", {});
});

router.get('/game-state', async (req, res) => {

  let user_id = req.cookies.user_id; 
  let game_id = await Game.get_game_id(user_id); 

  let players = await Game.get_players_in_game(game_id); 
  let game_state = {}; 

  players.forEach((player) => {
    game_state[player.player_tag] = player;
  }); 

  let main_player_tag = await Game.get_player_tag(user_id, game_id);
  game_state.main_player = main_player_tag;

  game_state[main_player_tag].cards = 
                await Cards.get_cards_for_players(main_player_tag, game_id);

  let cur_card = await Game.get_current_card(game_id);

  let player_turn = await Game.get_player_turn(game_id); 

  game_state.cur_card = cur_card; 
  game_state.player_turn = player_turn; 
 
  console.log('game_state', game_state); 
  res.send(game_state); 
  // return that state 
}); 

router.get("/:game_id", async (req, res) => {
  let { game_id } = req.params;
  let { user_id } = req.cookies;

  res.render("game_board");
});

router.get("/test/:game_id", async (req, res) => {
  let { game_id } = req.params;

  res.render("game_board", { game_id });
});

router.post("/play-card", async(req, res) => {
  const { card, player_tag } = req.body;
  const { user_id } = req.cookies;

  const card_id = card.id; 
  let next_player = await serviceCards.play_card(card_id); 
  console.log('next_player', next_player); 

  let played_card = await Cards.played_card(card_id); 

  const io = req.app.get("io");
  res.json({ ok: true });

  let game_id = await Game.get_game_id(user_id);
  let room_id = 'game-room-' + game_id;
  console.log('emitting new state to room', room_id); 
  
  io.to(room_id).emit("game-update", { player_tag, next_player, played_card });
});

module.exports = router;
