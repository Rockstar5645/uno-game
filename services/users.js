
let User = require('../models/user');


let check_if_in_game = async (user_id) => {

    let game_id = await User.check_game(user_id);
    if (game_id === -1) {
        return {
            in_game: false
        };
    } else {
        return {
            in_game: true,
            game_id
        };
    }
};

module.exports = {
    check_if_in_game,
}; 