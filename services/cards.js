
let { set_top, get_player_tag } = require('../models/games.js'); 

let { change_card_location, get_cards_for_players } = require('../models/cards.js'); 

let get_cards = async (user_id) => {

    let player_tag = await get_player_tag(user_id); 
    let cards = await get_cards_for_players(player_tag); 
    
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


module.exports = {
    get_cards, 
    deal_cards
}