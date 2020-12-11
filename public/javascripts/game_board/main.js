import state from './state.js';
import something from './board_update.js';
import events from './events.js';

// document.getElementById('turn-direction').style.transform = 'scaleX(-1)';
// get game-state function called once on game init
(async () => {

  let res = await fetch(`/games/game-state`, {
    method: 'GET',
    credentials: 'include',
  });

  res = await res.json();
  console.log(res);

  state.set_curr_card(res.curr_card);
  // console.log('setting current card from main ', ); 
  state.set_curr_color(res.curr_color);

  initialize_player_positions(res);
  initialize_main_player(res);

  state.to_draw = res.draw_count;
  state.set_player_turn(res.player_turn);
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
  let player_usernames = {};

  // LEFT PLAYER 
  state.player_map[player_display[0].player_tag] = 'left_player_name';
  state.deck_map[player_display[0].player_tag] = 'left_player_deck';
  player_hand_count[player_display[0].player_tag] = player_display[0].card_count;
  player_usernames[player_display[0].player_tag] = player_display[0].username;

  // TOP PLAYER 
  state.player_map[player_display[1].player_tag] = "top_player_name";
  state.deck_map[player_display[1].player_tag] = 'top_player_deck';
  player_hand_count[player_display[1].player_tag] = player_display[1].card_count;
  player_usernames[player_display[1].player_tag] = player_display[1].username;

  // RIGHT_PLAYER 
  state.player_map[player_display[2].player_tag] = "right_player_name";
  state.deck_map[player_display[2].player_tag] = 'right_player_deck';
  player_hand_count[player_display[2].player_tag] = player_display[2].card_count;
  player_usernames[player_display[2].player_tag] = player_display[2].username;

  // MAIN PLAYER
  state.player_map[res.main_player] = 'main_player_name';
  state.deck_map[res.main_player] = 'main_player_deck';
  player_usernames[res.main_player] = res[res.main_player].username;

  state.set_other_players_hand_count(player_hand_count);
  state.set_other_players_usernames(player_usernames);

  // avatar stuff
  // let left_player_avatar_container = document.getElementById("left-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = player_display[0].avatar;
  // avatar_img.className = "avatar";
  // left_player_avatar_container.append(avatar_img);
};

let initialize_main_player = (res) => {
  let main_player_cards = {};

  res[res.main_player].cards.forEach((card) => {

    main_player_cards[card.id] = card;
  });

  state.set_main_player_hand(main_player_cards);

  // avatar stuff
  // let main_player_avatar_container = document.getElementById("bottom-player-avatar-container");
  // let avatar_img = document.createElement("img");
  // avatar_img.src = res[res.main_player].avatar;
  // avatar_img.className = "avatar";
  // main_player_avatar_container.append(avatar_img);
};


// initialize the events listeners for sockets and document elements 
events();


// initialize the event listeners for state changes 