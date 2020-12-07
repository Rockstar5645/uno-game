
let { get_players_in_queue, create_game } = require('../models/games.js'); 
let { get_player_count, insert_into_session } = require('../models/games.js'); 
let { deal_cards } = require('./cards.js'); 

module.exports = async (user_id) => {

    // check if there are no game sessions if there aren't, create one and add the player to it 
    // if there are active sessions but they are already full, create a new session 

    let latest_session = await get_players_in_queue(); 
    let game_id; 
    const player_tag = ['A', 'B', 'C', 'D'];

    if (latest_session.count === 0 || latest_session.count === 4) {
        // there are no current game sessions or they're all full, create a new one and
        game_id = await create_game(); 
        await insert_into_session(game_id, user_id, player_tag[latest_session.count % 4]); 
    } else {
        // there is an active session, add player to that game_id
        game_id = latest_session.game_id; 
        await insert_into_session(game_id, user_id, player_tag[latest_session.count]); 
    }

    let player_count = await get_player_count(game_id); 

    if (player_count === 4) {
        await deal_cards(game_id);
    }

    return 'success'; 
}