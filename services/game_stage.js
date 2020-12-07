
let { get_game_id } = require('../models/games.js');
let { get_player_count } = require('../models/games.js');

module.exports = async (msg, socket, io) => {

    let user_id = msg.user_id;
    let op = msg.op;

    switch (op) {
        case 'join':
            console.log('init operation called with user_id', user_id);
            let game_id = await get_game_id(user_id);
            let room_id = 'game-room-' + game_id;
            console.log('room id', room_id);

            let player_count = await get_player_count(game_id);
            console.log('player count', player_count);

            socket.join(room_id);
            console.log(socket.rooms);
            // responds to call in javascripts/game_stage.js
            io.to(room_id).emit('room-joined', {
                player_count: player_count,
                game_id: game_id,
                user_id: user_id
            });
            break;

        default:
            console.log('ollo');
            break;
    }
}