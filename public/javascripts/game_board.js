import Util from "./util.js";
import boardUpdate from "./board_update.js"; 

let player_turn; 
let main_player; 
let cur_card;
let cur_color;

let player_map = {};    // maps player tags to player names
let deck_map = {};      // maps player tags to player decks

let socket = io();
let user_id = Util.getCookie('user_id'); 

// let game_state = {
//   player_turn, 
//   main_player, 
//   player_map, 
//   deck_map, 
//   socket, 
//   user_id, 
// }; 

socket.emit('join-game-room', { user_id }, (res) => {
  console.log('response from join room', res); 
}); 

// called after every move
socket.on(`game-update`, (res) => {
  console.log("state received:", res);

  boardUpdate.played_card_update(res.played_card, res.player_tag, main_player, deck_map); 
  cur_card = res.played_card; 
  // player chooses color, update cur_color
  player_turn = res.next_player; 
});

document.getElementById("main_player_deck").addEventListener("click", async (event) => {
  
  if (main_player === player_turn) {

    let valid = true; 
    console.log("testing to see if I have access to the cur_card global variable in game_board:", cur_card);

    // cur_card = document.getElementById("played-card-id").dataset;
    // console.log("cur_card:", cur_card);
    const card = event.target.dataset;

    // validate card
    if(card.color !== "any" && (card.color !== cur_card.color && card.name !== cur_card.name)) {
      console.log("Illegal move. You can't play that card.");
      console.log("Card must be either of same color, or name, or a wild card.");
      valid = false; 
    } else {
      console.log('LEGAL MOVE, go ahead'); 
    }

    if(card.color === 'any'){
      alert('choose color');
      // pop up 4 different colored buttons
      // user click on button. the button has a dataset with color data
      // set cur_color to button.dataset.color
    }
    
    if (valid) {
      player_turn = 'Z'; 
      await boardUpdate.play_card(event, main_player); 
    }
  } else {
    console.log('not your turn!!!'); 
  }
});


let display_usernames = (res) => {
  let player_display = [];

  let prev = res.main_player;

  for (let i = 0; i < 3; i++) {
    let next_player_tag = boardUpdate.get_next(prev);
    player_display.push(res[next_player_tag]);
    prev = next_player_tag;
  }

  // LEFT PLAYER 
  let left_player = document.getElementById("left_player_name");
  player_map[player_display[0].player_tag] = "left_player_name";
  deck_map[player_display[0].player_tag] = 'left_player_deck'; 

  left_player.innerHTML = player_display[0].username;

  // avatar stuff
  // let left_player_avatar_container = document.getElementById("left-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = player_display[0].avatar;
  // avatar_img.className = "avatar";
  // left_player_avatar_container.append(avatar_img);

  for (let i = 0; i < player_display[0].card_count; i++) 
    add_card('left_player_deck'); 


  // TOP PLAYER 
  let top_player = document.getElementById("top_player_name");
  
  player_map[player_display[1].player_tag] = "top_player_name";
  deck_map[player_display[1].player_tag] = 'top_player_deck'; 

  top_player.innerHTML = player_display[1].username;

  for (let i = 0; i < player_display[1].card_count; i++) 
    add_card('top_player_deck'); 


  // MAIN PLAYER
  let main_player = document.getElementById("main_player_name");
  main_player.innerHTML = res[res.main_player].username;

  // RIGHT_PLAYER 
  let right_player = document.getElementById("right_player_name");
  player_map[player_display[2].player_tag] = "right_player_name";
  deck_map[player_display[2].player_tag] = 'right_player_deck'; 

  right_player.innerHTML = player_display[2].username;

  for (let i = 0; i < player_display[2].card_count; i++)
    add_card('right_player_deck'); 
};

let setup_main_player = (res) => {
  let main_cards = document.getElementById("main_player_deck");

  // avatar stuff
  // let main_player_avatar_container = document.getElementById("bottom-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = res[res.main_player].avatar;
  // avatar_img.className = "avatar";
  // main_player_avatar_container.append(avatar_img);

  res[res.main_player].cards.forEach((card) => {
    let card_item = document.createElement("li");
    card_item.className = "user-card";

    let card_img = document.createElement("img");
    card_img.src = `/images/uno_deck/${card.color}_${card.name}.png`;
    card_img.dataset.id = card.id; 
    card_img.dataset.color = card.color;
    card_img.dataset.name = card.name;

    card_item.append(card_img);

    main_cards.append(card_item);
  });
};

// target is the element ID where we want to append a new card
let add_card = (target) => {

  let player_deck = document.getElementById(target);
  let back_card = document.createElement("li");
  back_card.className = "user-card";

  let card_img = document.createElement("img");
  card_img.src = `/images/uno_deck/card_back.png`;

  back_card.append(card_img); 

  player_deck.append(back_card); 
}; 


// get game-state function called once on game init
(async () => {

let res = await fetch(`/games/game-state`, {
  method: 'GET',
  credentials: 'include', 
}); 

res = await res.json(); 

console.log(res);

cur_card = res.cur_card;
cur_color = res.cur_card.color;
let played_card = document.getElementById("played-card-id"); 
played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;
played_card.dataset.color = cur_card.color;
played_card.dataset.name = cur_card.name;


display_usernames(res);
setup_main_player(res);

player_turn = res.player_turn; 
main_player = res.main_player; 
player_map[res.main_player] = 'main_player_name'; 
deck_map[res.main_player] = 'main_player_deck'; 

})(); // end of game-state function

// are we even using this????
// socket.on("card-played", (card) => {
//   let played_card = document.getElementById("played-card-id");
//   played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;
// });

