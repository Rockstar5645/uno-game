
let game_stage = require('./services/game_stage');
let { handle_socket } = require('./services/game_board'); 
let { lobbySendMessage } = require("./models/lobby");

let Games = require('./models/games'); 

module.exports = async (io) => {
    io.on('connection', (socket) => {

        socket.on('player_added', async (msg) => {
            await add_player(msg, socket, io); // where is add_player coming from????
        });
        
        // Listen for lobby chat message
        socket.on("lobby-send-chat-message", async (data) => {
            // console.log(data);
            socket.broadcast.emit("lobby-chat-message", data);
            // update database
            await lobbySendMessage(data.user_id, data.message);
        })

        socket.on('chat message', (msg) => {
            // console.log('message', msg);
            // console.log('socket id', socket.id); 
        });

        socket.on('game-board-cb', async (msg, cb) => {
            // console.log('game-board', msg);

            await handle_socket(msg, cb); 
        });

        socket.on('game-stage', async (msg) => {
            console.log('game-stage', msg);
            await game_stage(msg, socket, io);
        });

        socket.on('join-game-room', async (msg, cb) => {
            console.log('join-game-room', msg); 
            let game_id = await Games.get_game_id(msg.user_id);
            let room_id = 'game-room-' + game_id;
            console.log('room id', room_id);

            socket.join(room_id);

            cb('added user to game room id ' + room_id); 
        }); 


        // socket.on('deal', (msg, callback) => {
        //     console.log(msg);
        //     callback('calling you back');
        // });
    });
}