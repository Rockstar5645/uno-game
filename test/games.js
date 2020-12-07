let { create_game, insert_into_session } = require('../models/games.js'); 
let add_user = require('../services/gq'); 

const db = require('../db');


let create_game_test = async () => {
    
    await add_user(5); 
    await add_user(6); 
    await add_user(7); 
    await add_user(8); 
}

let delete_game_test = async (game_id) => {
    const DELETE_GAME = `DELETE FROM games WHERE id=($1)`; 
    await db.none(DELETE_GAME, game_id);
    console.log('deleted game with id ', game_id); 
}

module.exports = {
    create_game_test, 
    delete_game_test
}