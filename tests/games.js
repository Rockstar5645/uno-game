const db = require('../db');

const add_user = require('../services/gq'); 

let create_game_test = async () => {
    
    await add_user(3); 
    await add_user(4); 
    await add_user(5); 
    await add_user(6); 
}

let delete_game_test = async (game_id) => {
    const DELETE_GAME = `DELETE FROM games WHERE 1=1`; 
    await db.none(DELETE_GAME);
    // console.log('deleted game with id anything'); 
}

module.exports = {
    create_game_test, 
    delete_game_test
}