const db = require('../db');
const Game = require('./games');

let change_card_location = async (order, game_id, player) => {

    const CHANGE_CARD_LOCATION = `UPDATE game_deck SET location=($1) WHERE game_id=($2) AND "order"=($3)`;
    await db.none(CHANGE_CARD_LOCATION, [player, game_id, order]);
};

let get_cards_for_players = async (player_tag, game_id) => {

    const GET_CARDS = `SELECT * FROM game_deck WHERE location=($1) AND game_id=($2)`;
    let res = await db.manyOrNone(GET_CARDS, [player_tag, game_id]);
    return res;
}; 

let get_card_with_order = async (order, game_id) => {

    const GET_CARD = `SELECT * FROM game_deck WHERE "order"=($1) AND game_id=($2)`;
    var res = await db.one(GET_CARD, [order, game_id]);

    return res;
};

let change_card_location_to_played = async (card_id) => {
    const CHANGE_CARD_LOCATION = `UPDATE game_deck SET location=($1) WHERE id=($2)`;
    await db.none(CHANGE_CARD_LOCATION, ['played', card_id]);
};

let get_gid_from_card = async (card_id) => {
    const GGFC = `SELECT game_id FROM game_deck WHERE id=($1)`;
    let res = await db.one(GGFC, card_id);
    return res.game_id;
}; 

let played_card = async (card_id) => {

    const GET_CARD = `SELECT * FROM game_deck WHERE id=($1)`; 
    let played_card = db.one(GET_CARD, card_id); 

    return played_card; 
}; 

const get_card_id = async (order, game_id) => { 
    
    console.log('function getting called');
    const GET_CARD_ID = `SELECT id FROM game_deck WHERE game_id=($1) AND "order"=($2)`; 
    
    let card_id = await db.one(GET_CARD_ID, [game_id, order]); 

    return card_id; 
}; 

module.exports = {
    change_card_location,
    change_card_location_to_played,
    get_cards_for_players,
    get_card_with_order,
    get_gid_from_card,
    played_card, 
    get_card_id, 
}; 