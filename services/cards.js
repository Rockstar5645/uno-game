
let { set_top, get_player_tag, get_top, get_game_id } = require('../models/games.js');
let { update_current_card, get_turn_direction, get_player_turn } = require('../models/games.js');
let { set_player_turn } = require('../models/games.js');
 
let { change_card_location, get_cards_for_players, get_card_with_order } = require('../models/cards.js'); 
let { change_card_location_to_played, get_gid_from_card } = require('../models/cards.js'); 

let get_cards = async (user_id) => {

    let game_id = await get_game_id(user_id); 
    let player_tag = await get_player_tag(user_id, game_id); 
    let cards = await get_cards_for_players(player_tag, game_id); 
    
    return cards; 
}; 

let draw_cards = async (user_id, n_cards) => { 

    // get the top n_cards from the deck 

    let game_id = await get_game_id(user_id); 
    let player_tag = await get_player_tag(user_id, game_id); 
    let top_order = await get_top(game_id); 

    let cards = []; 

    for (let i = 0; i < n_cards; i++) {
        let card = await get_card_with_order(top_order, game_id);
        await change_card_location(top_order, game_id, player_tag); 
        
        cards.push(card); 
        top_order++; 
    }
    
    await set_top(top_order, game_id); 

    return cards; 
}; 

let deal_cards = async (game_id) => {

    let start_top = 0; 
    const player_tag = [ 'A', 'B', 'C', 'D' ];

    for (let i = 0; i < player_tag.length; i++) {

        for (let order = start_top; order < start_top + 7; order++) {
            await change_card_location(order, game_id, player_tag[i]); 
        }
        start_top += 7;
    }

    await set_top(28, game_id); 
}; 

let play_card = async (card_id) => {

    await change_card_location_to_played(card_id); 
    let game_id = await get_gid_from_card(card_id); 

    await update_current_card(game_id, card_id); 

    let turn_direction = await get_turn_direction(game_id); 
    let current_player = await get_player_turn(game_id); 
    let next_player; 
    
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

    await set_player_turn(game_id, next_player);
    return next_player; 
}; 


module.exports = {
    get_cards, 
    deal_cards, 
    draw_cards,
    play_card, 
}