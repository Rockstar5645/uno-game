
import Util from './util.js';
// const Util = require('./util.js');
const joinGameBtn = document.getElementById("join-game-btn");

// dummy userIds
const userIds = {
    userA: 1,
    userB: 2,
    userC: 3,
    userD: 4
}

let socket = io();
socket.emit('chat message', {
    user_id: Util.getCookie('user_id')
});

// socket.emit("deal", {
//     abc: 123
// }, (res) => {
//     console.log(res);
// });

function joinGame(userIds) {
    let user_id = Util.getCookie('user_id');
    console.log(">> Creating new game. Adding userId:", user_id);

    fetch(`/lobby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user_id
        })
    })
        .then(res => res.json())
        .then(res => {

            console.log('redirecting to games/stage');
            console.log(res);

            if (res.status === 'success') {
                window.location.href = "games/stage";
            }
        })
        .catch(e => console.log("Error joining a game.", e));
}

joinGameBtn.addEventListener('click', (userIds) => {
    joinGame(userIds);
});
