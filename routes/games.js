const { response } = require("express");
const express = require("express");
const router = express.Router();

const Game = require('../models/games');
const Cards = require('../models/cards');
const serviceCards = require('../services/cards');
const Players = require('../models/players');
const User = require('../models/user');

let { game_board_init } = require("../services/game_board");

// /games  - endpoint
// CAUTION: the order of these routes matter

// queue staging area
router.get("/stage", (req, res) => {
  res.render("game_stage", {});
});


router.post('/draw-card', async (req, res) => {

  let { main_player } = req.body;
  let user_id = req.cookies.user_id;
  try {
    let cards = await serviceCards.draw_cards(user_id, 1);
    // console.log('drew cards', cards);
    res.json({
      cards,
      status: 'ok'
    });

    // console.log('sending socket update for draw cards');
    let game_id = await Game.get_game_id(user_id);
    let room_id = 'game-room-' + game_id;

    let cards_update = {
      main_player,
      card_increase: 1
    };

    const io = req.app.get("io");
    // console.log('sending cards update to ', room_id, ' with payload ', cards_update);
    io.to(room_id).emit('cards-update', cards_update);

  } catch (e) {
    console.log("Couldn't draw cards.", e);
    res.json({
      status: 'not_ok'
    });
  }
});

// gathers data from DB to update the game state
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

  let curr_card = await Game.get_current_card(game_id);
  let curr_color = await Game.get_current_color(game_id);
  let player_turn = await Game.get_player_turn(game_id);
  let draw_count = await Players.get_draw_count(main_player_tag, game_id);
  let turn_direction = await Game.get_turn_direction(game_id);

  game_state.draw_count = draw_count;
  game_state.curr_card = curr_card;
  game_state.curr_color = curr_color;
  game_state.player_turn = player_turn;
  game_state.turn_direction = turn_direction;

  // console.log('game_state', game_state);
  res.send(game_state);
  // return that state 
});

/**
 * Validates player't turn. (player move validated on frontend)
 * Plays the card, which updated DB
 * Sends a broadcast to everyone in a room w/ updated info
 */
router.post("/play-card", async (req, res) => {
  const { card, main_player, chosen_color } = req.body;

  // console.log('card', card);
  // console.log('player_tag', main_player); 

  const { user_id } = req.cookies;

  if (await serviceCards.allowed_to_play(user_id, main_player)) {

    const card_id = card.id;
    let next_player = await serviceCards.play_card(card_id, chosen_color);
    // console.log('next_player', next_player); 

    let played_card = await Cards.get_card_by_id(card_id);

    let game_id = await Game.get_game_id(user_id);
    let num_cards_left = await Cards.get_num_cards_left(main_player, game_id);
    const io = req.app.get("io");
    let room_id = 'game-room-' + game_id;

    if (num_cards_left === 0) {

      let username = User.get_username(user_id);
      res.json({ status: 'game_won' });
      io.to(room_id).emit('game-over', {
        player_won: username,
        player_won_tag: main_player,
      });
      await Game.delete_game(game_id);

    } else {

      res.json({ status: 'good-to-go' });
      // console.log('emitting new state to room', room_id); 

      let turn_direction = await Game.get_turn_direction(game_id);

      let player_tag = main_player;
      let socket_broadcast = {
        player_tag,
        next_player,
        played_card,
        current_color: chosen_color,
        turn_direction,
      };

      // console.log('player-tag broadcast', player_tag); 
      // console.log('broadcast', socket_broadcast); 

      io.to(room_id).emit("game-update", socket_broadcast);
    }
  } else {

    res.json({ status: 'not_allowed' });
  }
});

router.post('/call-uno', async (req, res) => {

  const { user_id } = req.cookies;
  const { main_player } = req.body;

  let game_id = await Game.get_game_id(user_id);

  let card_count = await Cards.get_num_cards_left(main_player, game_id);
  console.log('game_id', game_id);
  console.log('card_count', card_count);

  if (card_count === 2) {

    await Players.update_uno_status('called', user_id);
    res.json({
      status: 'okay'
    });

  } else {
    res.json({
      status: 'cant_call',
    });
  }
});

router.post('/callout', async (req, res) => {

  let { user_id } = req.cookies;

  let game_id = await Game.get_game_id(user_id);
  console.log('game_id', game_id);

  let prev_player = await Game.get_prev_player(game_id);
  console.log('prev_player', prev_player);

  let uno_status = await Players.get_uno_status(prev_player, game_id);
  console.log('uno_status', uno_status);

  if (uno_status !== 'available') {
    res.json({
      status: 'invalid-callout',
    });
  } else {

    let draw_count = await Players.get_draw_count(prev_player, game_id);
    console.log('draw_count', draw_count);
    draw_count += 4;
    await Players.set_draw_count(draw_count, prev_player, game_id);

    let prev_user_id = await Players.get_id_from_player_tag(prev_player, game_id);
    console.log('prev_user_id', prev_user_id);

    await Players.update_uno_status('unavailable', prev_user_id);

    res.json({
      status: 'valid-callout',
    });
  }
});

router.get('/empty_draw_stack', async (req, res) => {
  const { user_id } = req.cookies;
  console.log('trying to broadcast empty_draw_stack message');

  const io = req.app.get("io");
  res.json({ status: 'good-to-go' });

  let game_id = await Game.get_game_id(user_id);
  let room_id = 'game-room-' + game_id;
  io.to(room_id).emit("empty-draw-stack");

});

router.get("/:game_id", async (req, res) => {
  let { game_id } = req.params;
  let { user_id } = req.cookies;

  res.render("game_board");
});

module.exports = router;
