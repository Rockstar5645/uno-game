const db = require('../db');
// import { get_player_info, get_player_tag } from '../models/games.js';
const Game = require('../models/games');
const Cards = require('../models/cards');
const CardServices = require('../services/cards');

// /games/:game_id
exports.startGame = async (req, res) => {
    var { game_id } = req.params;
    var { user_id } = req.cookies;
    console.log("helpers/games: startGame: Game ID:", game_id, 'User ID:', user_id);

    try {
        // get all players's data
        var player_a = await Game.get_player_info('A', game_id);
        var player_b = await Game.get_player_info('B', game_id);
        var player_c = await Game.get_player_info('C', game_id);
        var player_d = await Game.get_player_info('D', game_id);

        player_a.cards = await Cards.get_cards_for_players('A', game_id);
        player_b.cards = await Cards.get_cards_for_players('B', game_id);
        player_c.cards = await Cards.get_cards_for_players('C', game_id);
        player_d.cards = await Cards.get_cards_for_players('D', game_id);

        // console.log("players:", player_a, player_b, player_c, player_d);

        // find who main player is
        var main_player_tag = await Game.get_player_tag(user_id, game_id);
        // console.log("main player tag:", main_player_tag);

        // get currrent card and pass it to view
        var cur_card = await Game.get_starting_card(game_id);
        // console.log("current card in play:", cur_card);

        await Game.update_current_card(game_id, cur_card.id);

    } catch (e) {
        console.log("Error in route /games/:game_id, startGame() helper.");
        console.log(e);
    }

    res.render("game_board", {
        player_a,
        player_b,
        player_c,
        player_d,
        main_player_tag,
        cur_card
    });
}

exports.testGame = (req, res) => {
    res.render("g_board_test", {});
}

module.exports = exports;

// players example:
// players: 
// {
//     id: 9,
//     game_id: 3,
//     user_id: 1,
//     uno_status: 'unavailable',
//     player_tag: 'A',
//     username: 'tu0',
//     avatar: '/images/avatars/avatar-flat-9.png'
// }