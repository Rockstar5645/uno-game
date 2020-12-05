
let { set_top, get_player_tag, get_top, get_game_id } = require('../models/games.js'); 

let { change_card_location, get_cards_for_players, get_card_with_order } = require('../models/cards.js'); 

let get_cards = async (user_id) => {

    let player_tag = await get_player_tag(user_id); 
    let cards = await get_cards_for_players(player_tag); 
    
    return cards; 
}; 

let draw_cards = async (user_id, n_cards) => { 

    // get the top n_cards from the deck 

    let game_id = await get_game_id(user_id); 
    let player_tag = await get_player_tag(user_id); 
    let top_order = await get_top(game_id); 

    let cards = []; 

    for (let i = 0; i < n_cards; i++) {
        let card = await get_card_with_order(top_order);
        await change_card_location(top_order, game_id, player_tag); 
        
        cards.push(card); 
        top_order++; 
    }
    
    await set_top(top_order, game_id); 

    return cards; 
}

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
    deal_cards, 
    draw_cards,
}