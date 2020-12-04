import {getCookie} from './util.js';

let socket = io(); 

socket.emit('game-stage', {
    user_id: getCookie('user_id'), 
    op: 'join'
}); 


socket.on('room-joined', (msg) => {
    console.log('room joined message', msg); 
    let count = msg.player_count; 

    let elem = document.getElementById('status');
    let players_left = 4 - count; 

    if (players_left === 0) {

        elem.innerHTML = "Starting the game..."; 
        window.location.href = "/games";
    } else {
        elem.innerHTML = "Waiting for " + players_left + " more players."; 
    }
}); 