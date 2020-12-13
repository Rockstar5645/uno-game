import Util from '../util.js';
import state from './state.js';

let socket = io();
let user_id = Util.getCookie('user_id');

console.log('events is still getting imported');

socket.emit('join-game-room', { user_id }, (res) => {
  // console.log('response from join room', res); 
});

// called after every move 
/** res = let socket_broadcast = {
  player_tag, 
  next_player, 
  played_card,
  current_color: chosen_color,
}; */

socket.on('empty-draw-stack', () => {
  console.log("draw stack is empty");
  document.getElementById('draw_deck').style.visibility = 'hidden';
});


socket.on(`game-update`, async (res) => {
  // remove the previous player's name's background color
  // state.player_map[player_display[0].player_tag] = 'left_player_name';
  console.log(state.player_map);
  console.log(state.player_turn);

  console.log("state received:", res);
  state.player_turn = res.next_player;
  state.set_player_turn(res.next_player);
  state.set_curr_card(res.played_card);
  state.set_curr_color(res.current_color);

  state.set_turn_direction(res.turn_direction);

  console.log('checking if we need to draw');
  if (state.player_turn === state.main_player) {

    console.log('we may need to draw');
    // it's now my turn 
    let nums = 0;
    // if it's draw 2, 
    if (state.curr_card.name === "draw_2") {
      nums = 2;
    } else if (state.curr_card.name === "draw_4") {
      nums = 4;
    }
    state.to_draw = nums;

    console.log('drawing ', nums, ' times');
    for (let i = 0; i < nums; i++) {
      await draw_from_deck();
    }
  }

  if (res.player_tag !== state.main_player) {
    let hands_counts = state.other_players_hand_count;
    hands_counts[res.player_tag] = hands_counts[res.player_tag] - 1;
    state.set_other_players_hand_count(hands_counts);
  }
});

// res = { main_player, card_increase: 1 }
socket.on('cards-update', async (res) => {
  console.log('received cards update');
  console.log(res);

  if (state.main_player !== res.main_player) {
    let main_player = res.main_player;
    let card_increase = res.card_increase;

    let other_players_hand_count = state.other_players_hand_count;
    other_players_hand_count[main_player] = other_players_hand_count[main_player] + card_increase;

    state.set_other_players_hand_count(other_players_hand_count);
  }
});

// draw a card from draw stack

let draw_from_deck = async () => {
  if (state.main_player === state.player_turn) {
    console.log('attempting to draw a card');
    let res_head = await fetch(`/games/draw-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        main_player: state.main_player,
      }),
    });

    let res = await res_head.json();
    console.log("response from draw-card:", res);

    if (res.status === 'ok') {
      let cards = res.cards;
      let main_player_hand = state.main_player_hand;
      for (let i = 0; i < cards.length; i++) {
        main_player_hand[cards[i].id] = cards[i];
      }

      state.set_main_player_hand(main_player_hand);
      state.to_draw--;
    } else {
      console.log('there are NO MORE CARDS TO DRAW FROM THE DECK!!!!');
      document.getElementById('draw_deck').style.visibility = 'hidden';

      res_head = await fetch(`/games/empty_draw_stack`, {
        method: 'GET',
        headers: { "Accept": "application/json" },
        credentials: 'include',
      });

      console.log('response head', res_head);
      res = await res_head.json();
      console.log(res);
    }

  } else {
    console.log('not your turn!!');
  }
};

document.getElementById('draw_deck').addEventListener('click', async (event) => {
  try {
    await draw_from_deck();
  } catch (e) {
    console.log('draw deck error', e);
  }

});


// let click_handler = (e) => {
//   return new Promise
//   console.log("event:", e);
//   console.log('color', e.target.dataset.color); 
//   resolve(e.target.dataset.color); 

// }

// document.getElementById('color-chooser').addEventListener('click', click_handler); 

document.getElementById("main_player_deck").addEventListener("click", async (event) => {

  if (state.main_player === state.player_turn) {

    let valid = true;

    // cur_card = document.getElementById("played-card-id").dataset;
    // console.log("cur_card:", cur_card);
    const card = event.target.dataset;

    // validate card
    // NEXT STEP: change card.color to state.color

    if (card.color !== "any" && (card.color !== state.curr_color && card.name !== state.curr_card.name)) {
      alert("Illegal move. You can't play that card.\nCard must be either of same color, or name, or a wild card.");
      valid = false;
    } else if (state.to_draw > 0) {
      alert('ILLEGAL MOVE: still have to draw some cards');
      // alert('draw a card first dumbass'); 
      valid = false;
    } else {
      console.log('LEGAL MOVE, go ahead');
    }

    let chosen_color = card.color;
    if (valid) {

      state.player_turn = 'Z';
      const card = event.target.dataset;
      if (card.color === 'any') {

        document.getElementById('color-chooser').style.visibility = "visible"; // display color-chooser

        let color_pick = async () => {
          return new Promise(function (resolve, reject) {

            let click_handler = (e) => {
              console.log("event:", e);
              console.log('color', e.target.dataset.color);
              document.getElementById('color-chooser').removeEventListener('click', click_handler);
              resolve(e.target.dataset.color);
            };

            document.getElementById('color-chooser').addEventListener('click', click_handler);
          });
        }

        chosen_color = await color_pick();
        document.getElementById('color-chooser').style.visibility = "hidden"; // hide color-chooser
        console.log('chosen color is ', chosen_color);

        // pop up 4 different colored buttons

        // user click on button. the button has a dataset with color data
        // set cur_color to button.dataset.color
      }
      console.log("playing card:", card);
      // console.log("testing to see if I have access to the cur_card global variable in game_board:", cur_card);
      let main_player_hand = state.main_player_hand;
      delete main_player_hand[card.id];
      state.set_main_player_hand(main_player_hand);

      let res_head = await fetch(`/games/play-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          card,
          main_player: state.main_player,
          chosen_color
        }),
      });
      // remove background color from name
      let res = await res_head.json();
      console.log(res);
      if (res.status === 'not_allowed') {
        alert(res.reason);
      }
    }
  } else {
    console.log('not your turn!!!');
    alert("not your turn, noodle head!!!");
  }
});


export default socket; 
