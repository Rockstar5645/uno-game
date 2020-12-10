const db = require('../db');

let get_draw_count = async (player_tag, game_id) => {

    const GET_DC = `SELECT draw_count FROM players WHERE player_tag=($1) AND game_id=($2)`;
    let res = await db.one(GET_DC, [player_tag, game_id]);
    return res.draw_count; 
}

let set_draw_count = async (draw_count, player_tag, game_id) => {

    const SET_DC = `UPDATE players SET draw_count=($1) WHERE player_tag=($2) AND game_id=($3)`;
    await db.none(SET_DC, [draw_count, player_tag, game_id]); 
}

module.exports = {
    get_draw_count, 
    set_draw_count, 
}