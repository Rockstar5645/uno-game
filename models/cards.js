const db = require('../db');
const Game = require('./games');

let change_card_location = async (order, game_id, player) => {

    const CHANGE_CARD_LOCATION = `UPDATE game_deck SET location=($1) WHERE game_id=($2) AND "order"=($3)`;
    await db.none(CHANGE_CARD_LOCATION, [player, game_id, order]);
};

let get_cards_for_players = async (player_tag, game_id) => {

    const GET_CARDS = `SELECT * FROM game_deck WHERE location=($1) AND game_id=($2)`;
    let res = await db.many(GET_CARDS, [player_tag, game_id]);
    return res;
}

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
}


module.exports = {
    change_card_location,
    change_card_location_to_played,
    get_cards_for_players,
    get_card_with_order,
    get_gid_from_card,
}; 