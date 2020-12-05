import { getCookie } from './util.js';

let socket = io();

socket.emit('game-stage', {
    // goes to services/game_stage.js
    user_id: getCookie('user_id'),
    op: 'join'
});


socket.on('room-joined', (msg) => {
    console.log('room joined message', msg);
    let { player_count, game_id, user_id } = msg;

    let elem = document.getElementById('status');
    let players_left = 4 - player_count;

    if (players_left === 0) {

        elem.innerHTML = "Starting the game...";
        window.location.href = `/games/${game_id}/${user_id}`;
    } else {
        elem.innerHTML = "Waiting for " + players_left + " more players.";
    }
}); 