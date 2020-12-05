const db = require('../db');

let change_card_location = async (order, game_id, player) => {

    const CHANGE_CARD_LOCATION = `UPDATE game_deck SET location=($1) WHERE game_id=($2) AND "order"=($3)`; 
    await db.none(CHANGE_CARD_LOCATION, [player, game_id, order]);
}; 

let get_cards_for_players = async (player_tag) => {

    const GET_CARDS = `SELECT * FROM game_deck WHERE location=($1)`;
    let res = await db.many(GET_CARDS, player_tag); 
    return res;
}

let get_card_with_order = async (order) => {

    const GET_CARD = `SELECT * FROM game_deck WHERE "order"=($1)`;
    let res = await db.one(GET_CARD, order); 
    return res; 
}

module.exports  = {
    change_card_location, 
    get_cards_for_players,
    get_card_with_order, 
}