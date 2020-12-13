const db = require('../db');

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

let get_card_id = async (order, game_id) => {
    const GET_CARD_ID = `SELECT id FROM game_deck WHERE game_id=($1) AND "order"=($2)`;
    let res = await db.one(GET_CARD_ID, [game_id, order]);
    return res.id;
};

let get_card_by_id = async (card_id) => {
    const GCBI = `SELECT * FROM game_deck WHERE id=($1)`;
    let res = await db.one(GCBI, card_id);
    return res;
};

let get_num_cards_left = async (player_tag, game_id) => {

    const GNCL = `SELECT COUNT(*) FROM game_deck WHERE location=($1) AND game_id=($2)`;
    let res = await db.one(GNCL, [player_tag, game_id]);
    return parseInt(res.count, 10);
}

let in_hand = async (player_tag, card_id) => {

    const CIIH = `SELECT COUNT(*) FROM  game_deck WHERE location=($1) AND id=($2)`;
    let res = await db.one(CIIH, [player_tag, card_id]);
    console.log('count', res.count);

    if (parseInt(res.count, 10) === 0) {
        return false;
    }
    return true;
}

module.exports = {
    change_card_location,
    change_card_location_to_played,
    get_cards_for_players,
    get_card_with_order,
    get_gid_from_card,
    get_card_id,
    get_card_by_id,
    get_num_cards_left,
    in_hand,
}; 
