const newGameBtn = document.getElementById("new-game-btn");
console.log("In lobby script!");
// dummy userIds
const userIds = {
    userA: 1,
    userB: 2,
    userC: 3,
    userD: 4
}

function createNewGame(userIds) {
    console.log("Fetching a new game with dummy userIds");
    fetch(`http://localhost:3000/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: 1
        })
    })
        .then(res => console.log(res))
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
