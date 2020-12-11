const db = require('../db');

const add_user = require('../services/gq'); 

let create_game_test = async () => {
    
    await add_user(3); 
    await add_user(4); 
    await add_user(5); 
    await add_user(6); 
}; 

let delete_game_test = async (game_id) => {
    const DELETE_GAME = `DELETE FROM games WHERE 1=1`; 
    await db.none(DELETE_GAME);
    // console.log('deleted game with id anything'); 
}; 


let change_hand = async (player_tag, target_cards) => {
    
    const CD2 = `UPDATE game_deck SET location=($1) where name=($2)`;
    await db.none(CD2, [player_tag, target_cards]);
};

module.exports = {
    create_game_test, 
    delete_game_test, 
    change_hand
}