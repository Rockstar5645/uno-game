const Games = require("../models/games");

let reverse_direction = async (game_id) => {

    let turn_direction = await Games.get_turn_direction(game_id); 
    
    let next_turn_direction = (turn_direction === 'F' ? 'R' : 'F');
    
    await Games.set_turn_direction(game_id, next_turn_direction); 
}; 

let skip_turn = async (game_id) => {

    let player_turn = await Games.get_player_turn(game_id); 
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

    await Games.set_player_turn(game_id, next_turn); 
}

module.exports = {
    reverse_direction, 
    skip_turn,
}