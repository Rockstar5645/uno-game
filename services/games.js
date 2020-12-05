const { get_turn_direction, set_turn_direction } = require("../models/games");

const { get_player_turn, set_player_turn } = require("../models/games");

let reverse_direction = async (game_id) => {

    let turn_direction = await get_turn_direction(game_id); 
    
    let next_turn_direction = (turn_direction === 'F' ? 'R' : 'F');
    
    await set_turn_direction(game_id, next_turn_direction); 
}; 

let skip_turn = async (game_id) => {

    let player_turn = await get_player_turn(game_id); 
    let next_turn; 

    switch (player_turn) {
        case 'A':
            next_turn = 'C';
            break; 
        case 'B':
            next_turn = 'D';
            break;
        case 'C':
            next_turn = 'A';
            break; 
        case 'D':
            next_turn = 'B';
            break; 
    }

    await set_player_turn(game_id, next_turn); 
}

module.exports = {
    reverse_direction, 
    skip_turn,
}