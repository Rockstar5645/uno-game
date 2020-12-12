import Util from '../util.js';
import state from './state.js';

const uno_btn = document.getElementById('uno-btn');
const callout_btn = document.getElementById('callout-btn');

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