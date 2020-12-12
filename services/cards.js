const Game = require('../models/games');
const Cards = require('../models/cards');
const Players = require('../models/players');
const serviceGame = require('./games');

let get_cards = async (user_id) => {

    let game_id = await Game.get_game_id(user_id);
    let player_tag = await Game.get_player_tag(user_id, game_id);
    let cards = await Cards.get_cards_for_players(player_tag, game_id);

    return cards;
};

/**
 * Gets n cards from game_deck and returns them.
 * Updates the card location to player 'X'.
 * Updates the top card on the draw stack.
 * 
 * @param   {Number}    user_id
 * @param   {Number}    n_cards 
 * @return  {Array}     cards
 */
let draw_cards = async (user_id, n_cards) => {

    // get the top n_cards from the deck 
    let game_id = await Game.get_game_id(user_id);
    let player_tag = await Game.get_player_tag(user_id, game_id);
    let top_order = await Game.get_top(game_id);

    let cards = [];

    for (let i = 0; i < n_cards; i++) {
        let card = await Cards.get_card_with_order(top_order, game_id);
        await Cards.change_card_location(top_order, game_id, player_tag);

        cards.push(card);
        top_order++;
    }

    await Game.set_top(top_order, game_id);

    let draw_count = await Players.get_draw_count(player_tag, game_id);
    draw_count = draw_count - 1;
    if (draw_count >= 0) {
        await Players.set_draw_count(draw_count, player_tag, game_id);
    }

    return cards;
};

let deal_cards = async (game_id) => {

    let start_top = 0;
    const player_tag = ['A', 'B', 'C', 'D'];

    for (let i = 0; i < player_tag.length; i++) {

        for (let order = start_top; order < start_top + 7; order++) {
            await Cards.change_card_location(order, game_id, player_tag[i]);
        }
        start_top += 7;
    }

    // set the curent card to start the game with
    await Cards.change_card_location(28, game_id, "played");

    let card_id = await Cards.get_card_id(28, game_id);
    let card = await Cards.get_card_by_id(card_id);
    await Game.update_current_card(game_id, card_id);
    await Game.set_current_color(card.color, game_id);
    await Game.set_top(29, game_id);
};

/**
 * updates card 'location' from player 'X' to played
 * updates current_card being played on
 * updates who's turn it is after playing card
 * updates the current color
 * @param   {Number}    card_id         
 * @return  {String}    next_player     Who's turn it is now
 */
let play_card = async (card_id, chosen_color) => {

    let game_id = await Cards.get_gid_from_card(card_id);
    let card = await Cards.get_card_by_id(card_id);
    console.log('card played:', card);
    if (card.name === 'reverse') {
        console.log('we received a reverse card');
        await serviceGame.reverse_direction(game_id);
    }

    await Cards.change_card_location_to_played(card_id);
    await Game.update_current_card(game_id, card_id);
    await Game.set_current_color(chosen_color, game_id);


    let turn_direction = await Game.get_turn_direction(game_id);
    let current_player = await Game.get_player_turn(game_id);
    await Game.set_prev_player(current_player, game_id);

    let next_player;

    if (card.name === 'skip') {
        next_player = await serviceGame.skip_turn(game_id);
    } else {
        // clockwise
        if (turn_direction === 'F') {
            switch (current_player) {
                case 'A':
                    next_player = 'B';
                    break;
                case 'B':
                    next_player = 'C';
                    break;
                case 'C':
                    next_player = 'D';
                    break;
                case 'D':
                    next_player = 'A';
                    break;
            }
            // counter clockwise
        } else if (turn_direction === 'R') {
            switch (current_player) {
                case 'A':
                    next_player = 'D';
                    break;
                case 'B':
                    next_player = 'A';
                    break;
                case 'C':
                    next_player = 'B';
                    break;
                case 'D':
                    next_player = 'C';
                    break;
            }
        }
        await Game.set_player_turn(game_id, next_player);
    }

    let num = 0;
    if (card.name === 'draw_4') {
        num = 4;
    } else if (card.name === 'draw_2') {
        num = 2;
    }

    if (num !== 0) {
        await Players.set_draw_count(num, next_player, game_id);
    }

    return next_player;
};

let allowed_to_play = async (user_id, player_tag) => {

    let game_id = await Game.get_game_id(user_id);
    let to_draw = await Players.get_draw_count(player_tag, game_id);

    if (to_draw > 0) {
        return false;
    } else {
        return true;
    }
};

module.exports = {
    get_cards,
    deal_cards,
    draw_cards,
    play_card,
    allowed_to_play,
}