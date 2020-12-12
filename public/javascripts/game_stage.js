import Util from './util.js';

const socket = io();

socket.emit('game-stage', {
    // goes to services/game_stage.js
    user_id: Util.getCookie('user_id'),
    op: 'join'
});


socket.on('room-joined', (msg) => {
    console.log('room joined message', msg);
    let { player_count, game_id, players, user_id } = msg;

    let elem = document.getElementById('status');
    let players_left = 4 - player_count;


    if (players_left === 0) {

        elem.innerHTML = "Starting the game...";

        window.location.href = `/games/${game_id}`;
    } else {
        elem.innerHTML = "Waiting for " + players_left + " more players.";
        // display players' info 
        for (let i = 0; i < players.length; ++i ) {
            let player_avatar_elem = document.querySelector(`#player-avatar-${i}`);
            let player_name_elem = document.querySelector(`#player-name-${i}`);
            player_avatar_elem.src = players[i].avatar;
            player_name_elem.innerHTML = players[i].username;
        }
    }
}); 