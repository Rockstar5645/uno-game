
let game_stage = require('./services/game_stage.js'); 
let { lobbySendMessage } = require("./models/lobby");

module.exports = async (io) => {
    io.on('connection', (socket) => {

        socket.on('player_added', async (msg) => {
            await add_player(msg, socket, io); 
        }); 
        
        // Listen for lobby chat message
        socket.on("lobby-send-chat-message", async (data) => {
            // console.log(data);
            socket.broadcast.emit("lobby-chat-message", data);
            // update database
            await lobbySendMessage(data.user_id, data.message);
        })
        // socket.on('chat-message', (msg) => {
        //     console.log('message', "Hello world!");
        //     console.log('socket id', socket.id); 
        // });

        socket.on('game-board', (msg, cb) => {
            console.log('game-board', msg); 
            
            cb('card updated to played'); 
        }); 

        socket.on('game-stage', async (msg) => {
            console.log('game-stage', msg); 
            await game_stage(msg, socket, io); 
        }); 

        socket.on('deal', (msg, callback) => {
            console.log(msg); 
            callback('calling you back'); 
        }); 
    });
}