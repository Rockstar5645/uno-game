
let {get_players_in_queue, create_game, insert_into_session} = require('../models/games.js'); 


module.exports = async (user_id) => {

    // check if there are no game sessions if there aren't, create one and add the player to it 
    // if there are active sessions but they are already full, create a new session 

    let latest_session = await get_players_in_queue(); 

    if (latest_session.count === 0 || latest_session.count === 4) {
        // there are no current game sessions or they're all full, create a new one and
        let game_id = await create_game(); 
        await insert_into_session(game_id, user_id); 
    } else {
        // there is an active session, add player to that game_id
        let game_id = latest_session.game_id; 
        await insert_into_session(game_id, user_id); 
    }

    latest_session = await get_players_in_queue(); 

    if (latest_session.count === 4) {
        // start dealing the cards
        
    }

    return 'success'; 
}