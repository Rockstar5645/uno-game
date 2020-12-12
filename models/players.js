const db = require('../db');

let get_draw_count = async (player_tag, game_id) => {

    const GET_DC = `SELECT draw_count FROM players WHERE player_tag=($1) AND game_id=($2)`;
    let res = await db.one(GET_DC, [player_tag, game_id]);
    return res.draw_count;
};

let set_draw_count = async (draw_count, player_tag, game_id) => {

    const SET_DC = `UPDATE players SET draw_count=($1) WHERE player_tag=($2) AND game_id=($3)`;
    await db.none(SET_DC, [draw_count, player_tag, game_id]);
};

let update_uno_status = async (new_status, user_id) => {

    const UUS = `UPDATE players SET uno_status=($1) WHERE user_id=($2)`;
    await db.none(UUS, [new_status, user_id]);
};

let get_uno_status = async (player_tag, game_id) => {

    const GUS = `SELECT uno_status FROM players WHERE player_tag=($1) AND game_id=($2)`;
    let res = await db.one(GUS, [player_tag, game_id]);
    return res.uno_status;
};

let get_id_from_player_tag = async (player_tag, game_id) => {

    const GIFPT = `SELECT user_id FROM players WHERE player_tag=($1) AND game_id=($2)`;
    let res = await db.one(GIFPT, [player_tag, game_id]);
    return res.user_id;
}

module.exports = {
    get_draw_count,
    set_draw_count,
    update_uno_status,
    get_uno_status,
    get_id_from_player_tag,
}