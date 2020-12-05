const { get_turn_direction, set_turn_direction } = require("../models/games");

let reverse_direction = async (game_id) => {

    let turn_direction = await get_turn_direction(game_id); 
    
    let next_turn_direction = (turn_direction === 'F' ? 'R' : 'F');
    
    await set_turn_direction(game_id, next_turn_direction); 
}; 

module.exports = {
    reverse_direction, 
}