import state from './state.js'; 
import events from './events.js'; 

// get game-state function called once on game init
(async () => {

  let res = await fetch(`/games/game-state`, {
    method: 'GET',
    credentials: 'include', 
  }); 
  
  res = await res.json(); 

  state.set_curr_card = res.curr_card;
  state.set_curr_color = res.curr_card.color;
  
  
  initialize_player_positions(res);
  setup_main_player(res);
  
  state.player_turn = res.player_turn; 
  state.main_player = res.main_player; 
  
})(); // end of game-state function

let get_next = (player_tag) => {
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
}; 

let initialize_player_positions = (res) => {
  let player_display = [];

  let prev = res.main_player;

  for (let i = 0; i < 3; i++) {
    let next_player_tag = get_next(prev);
    player_display.push(res[next_player_tag]);
    prev = next_player_tag;
  }

  let player_hand_count = {}; 

  // LEFT PLAYER 
  state.player_map[player_display[0].player_tag] = 'left_player_name';
  state.deck_map[player_display[0].player_tag] = 'left_player_deck';
  player_hand_count[player_display[0].player_tag] = player_display[0].card_count; 

  // TOP PLAYER 
  state.player_map[player_display[1].player_tag] = "top_player_name";
  state.deck_map[player_display[1].player_tag] = 'top_player_deck'; 
  player_hand_count[player_display[1].player_tag] = player_display[1].card_count; 

  // RIGHT_PLAYER 
  state.player_map[player_display[2].player_tag] = "right_player_name";
  state.deck_map[player_display[2].player_tag] = 'right_player_deck'; 
  player_hand_count[player_display[2].player_tag] = player_display[2].card_count; 

  // MAIN PLAYER
  state.player_map[res.main_player] = 'main_player_name'; 
  state.deck_map[res.main_player] = 'main_player_deck'; 

  state.set_other_players_hand_count(player_hand_count); 

  // avatar stuff
  // let left_player_avatar_container = document.getElementById("left-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = player_display[0].avatar;
  // avatar_img.className = "avatar";
  // left_player_avatar_container.append(avatar_img);

};

let setup_main_player = (res) => {
  let main_cards = document.getElementById("main_player_deck");

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

  // avatar stuff
  // let main_player_avatar_container = document.getElementById("bottom-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = res[res.main_player].avatar;
  // avatar_img.className = "avatar";
  // main_player_avatar_container.append(avatar_img);
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


// initialize the events listeners 
events(); 