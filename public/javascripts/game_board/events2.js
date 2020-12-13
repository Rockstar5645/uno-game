import Util from '../util.js';
import state from './state.js';
import socket from './events.js';

const uno_btn = document.getElementById('uno-btn');
const callout_btn = document.getElementById('callout-btn');

let user_id = Util.getCookie('user_id');

socket.on('game-over', (end_game) => {
    const players_names = document.querySelectorAll("#player-name");
    const players_points = document.querySelectorAll("#player-point");
    const result_board = document.querySelector("#game-over");
    for (let i = 0; i < end_game.length; ++i) {
        players_names[i].innerHTML = end_game[i].username;
        players_points[i].innerHTML = end_game[i].total_points;
    }
    result_board.style.display = "flex";
    // alert('Game over, noodle heads!\n\nThe winner is: ' + end_game[0].username + "!");
    console.log('End game status:', end_game);
    // end_game = {
    //   player_won: username,
    //   player_won_tag: main_player,
    // }

});

socket.on('called-uno', (caller_id) => {
    console.log('got a called uno even');

    if (caller_id === user_id) {
        alert('You called UNO');
    } else {
        alert("Player " + state.user_id_map[caller_id] + " called UNO!!!");
    }
});

const call_uno = (e) => {

    if (state.main_player === state.player_turn) {

        console.log("attempting to call uno");
        fetch('/games/call-uno', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                main_player: state.main_player,
            }),
        })
            .then(res => res.json())
            .then(res => console.log(res));
    }
    else {
        alert('It is not your turn');
    }
}

const callout_prev_player = () => {
    if (state.main_player === state.player_turn) {
        console.log('attempting to callout prev player');
        fetch('/games/callout', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then(res => res.json())
            .then(res => console.log(res));
    } else {
        alert('It is not your turn');
    }
}

uno_btn.addEventListener('click', call_uno);
callout_btn.addEventListener('click', callout_prev_player);




export default {}; 