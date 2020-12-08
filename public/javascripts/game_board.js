import { getCookie } from "./util.js";

const gameId = document.querySelector("#gameId").value;

let socket = io();
let user_id = getCookie('user_id'); 

socket.emit('join-game-room', { user_id }, (res) => {
  console.log('response from join room', res); 
}); 

socket.on(`game-update`, (res) => {
  console.log("state received:", res);

  let played_card = document.getElementById("played-card-id"); 
  let cur_card = res.played_card; 
  player_turn = res.next_player; 
  played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;

  if (res.player_tag !== player_tag) {

    // we'll remove the back card from their set 
  }
});

document.getElementById("main_cards").addEventListener("click", async (event) => {
  const card = event.target.dataset;
  console.log(card.id); 

  if (main_player === player_turn) {
    player_turn = 'Z'; 

    event.target.remove(); 

    let res_head = await fetch(`/games/play-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ card, player_tag }),
      }); 

    let res = await res_head.json(); 
    console.log(res);

  } else {
    console.log('not your turn!!!'); 
  }
});


function get_next(player_tag) {
  switch (player_tag) {
    case "A":
      return "B";
    case "B":
      return "C";
    case "C":
      return "D";
    case "D":
      return "A";
  }
}

let player_map = {};

let display_usernames = (res) => {
  let player_display = [];

  let prev = res.main_player;

  for (let i = 0; i < 3; i++) {
    let next_player_tag = get_next(prev);
    player_display.push(res[next_player_tag]);
    prev = next_player_tag;
  }

  let left_player = document.getElementById("left_player_name");
  player_map[player_display[0].player_tag] = "left_player_name";
  left_player.innerHTML = player_display[0].username;

  for (let i = 0; i < player_display[0].card_count; i++) 
    add_card('left_player_deck'); 


  let top_player = document.getElementById("top_player_name");
  player_map[player_display[1].player_tag] = "top_player_name";
  top_player.innerHTML = player_display[1].username;

  for (let i = 0; i < player_display[1].card_count; i++) 
    add_card('top_player_deck'); 


  let main_player = document.getElementById("main_player_name");
  main_player.innerHTML = res[res.main_player].username;



  let right_player = document.getElementById("right_player_name");
  right_player.innerHTML = player_display[2].username;

  for (let i = 0; i < player_display[2].card_count; i++) 
    add_card('right_player_deck'); 
};

let setup_main_player = (res) => {
  let main_cards = document.getElementById("main_cards");

  res[res.main_player].cards.forEach((card) => {
    let card_item = document.createElement("li");
    card_item.className = "user-card";

    let card_img = document.createElement("img");
    card_img.src = `/images/uno_deck/${card.color}_${card.name}.png`;
    card_img.dataset.id = card.id; 

    // card_img.dataset.color = card.color;
    // card_img.dataset.name = card.name;

    card_item.append(card_img);

    main_cards.append(card_item);
  });
};

let add_card = (target) => {

  let player_deck = document.getElementById(target);
  let back_card = document.createElement("li");
  back_card.className = "user-card";

  let card_img = document.createElement("img");
  card_img.src = `/images/uno_deck/card_back.png`;

  back_card.append(card_img); 

  player_deck.append(back_card); 
}

let player_turn; 
let main_player; 

(async () => {

let res = await fetch(`/games/game-state`, {
  method: 'GET',
  credentials: 'include', 
}); 

res = await res.json(); 

console.log(res);

let cur_card = res.cur_card;
let played_card = document.getElementById("played-card-id"); 
played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;
// played_card.setAttribute('id', target); // just added this. target is a cardId right? should be added after removing from the player's hand first?


display_usernames(res);
setup_main_player(res);

player_turn = res.player_turn; 
main_player = res.main_player; 

})(); 

// socket.emit(
//   "game-board-cb",
//   {
//     op: "get_main",
//     user_id: getCookie("user_id"),
//   },
//   (res) => {
    
//   }
// );

socket.on("card-played", (card) => {
  let played_card = document.getElementById("played-card-id");
  played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;
});

// var url_string = window.location.href;
// var url = new URL(url_string);
// var game_id = url.searchParams.get("");

// get a player's hand
// const user_id = getCookie('user_id');
// console.log("User id:", user_id);

// async function getCards(user_id) => {
//     let res = await fetch(`http://localhost:3000/games/get_cards/${user_id}`);
//     return res.json();
// }

// const aCards = getCards(userId);
// console.log('aCards:', aCards);
// each person fetches their hand
// the db is updated
// the request responds with their hand
// the hand is updated visually w/ the response

// socket.emit('game-board', {
//     op: 'play-card',
//     card_id: 1
// }, (res) => {
//     console.log(res);
// });

// socket.on('card-played', {

// })
