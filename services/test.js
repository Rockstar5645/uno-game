process.env.DATABASE_URL = 'postgres://akhil:apples@192.168.1.102:5432/uno'; 

let {get_players_in_queue, insert_into_session, create_game} = require('../models/games.js'); 
let {get_game_id} = require('../models/games.js'); 

(async () => {

    let msg = await get_players_in_queue(); 
    console.log(msg); 
})(); 