const newGameBtn = document.getElementById("new-game-btn");
// dummy userIds
const userIds = {
    userA: 1,
    userB: 2,
    userC: 3,
    userD: 4
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

let socket = io(); 
socket.emit('chat message', {
    user_id: getCookie('user_id')
}); 

function createNewGame(userIds) {
    let user_id = getCookie('user_id'); 

    fetch(`http://localhost:3000/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user_id
        })
    })
        .then(res => res.json())
        .then(res => {
            console.log("response status: ", res.status); 
            if (res.status === 'success') {
                
            }
        })
        .catch(e => console.log("Error creating a new game.", e));
}

newGameBtn.addEventListener('click', (userIds) => {
    console.log("in the event listner");
    createNewGame(userIds);
});
