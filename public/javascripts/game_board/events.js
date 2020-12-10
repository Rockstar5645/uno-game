import Util from '../util.js';
import state from './state.js';

let event_listeners = () => {

    let socket = io();
    let user_id = Util.getCookie('user_id'); 

    socket.emit('join-game-room', { user_id }, (res) => {
        // console.log('response from join room', res); 
    }); 

    // called after every move
    socket.on(`game-update`, async (res) => {
        console.log("state received:", res);
        state.player_turn = res.next_player; 
        state.set_curr_card(res.played_card); 

        console.log('checking if we need to draw'); 
        if (state.player_turn === state.main_player) {

          console.log('we may need to draw'); 
          // it's now my turn 
          let nums = 0; 
          // if it's draw 2, 
          if(state.curr_card.name === "draw_2") {
            nums = 2; 
          } else if (state.curr_card.name === "draw_4"){
            nums = 4; 
          }

          state.to_draw = nums; 

          console.log('drawing ', nums, ' times'); 
          for (let i = 0; i < nums; i++) {
            await draw_from_deck();
            state.to_draw--; 
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
        console.log(res); 
        
        let cards = res.cards;
        let main_player_hand = state.main_player_hand; 
        for (let i = 0; i < cards.length; i++) {
          main_player_hand[cards[i].id] = cards[i]; 
        } 
        
        state.set_main_player_hand(main_player_hand); 
      

      } else {
        console.log('not your turn!!'); 
      }
  }; 

    document.getElementById('draw_deck').addEventListener('click',  (event) => {
        draw_from_deck();
    }); 
    
      
    document.getElementById("main_player_deck").addEventListener("click", async (event) => {
  
        if (state.main_player === state.player_turn) {
      
          let valid = true;
      
          // cur_card = document.getElementById("played-card-id").dataset;
          // console.log("cur_card:", cur_card);
          const card = event.target.dataset;
      
          // validate card
          if(card.color !== "any" && (card.color !== state.curr_card.color && card.name !== state.curr_card.name)) {
            console.log("Illegal move. You can't play that card.");
            console.log("Card must be either of same color, or name, or a wild card.");
            valid = false; 
          } else if (state.to_draw > 0) {
            console.log('ILLEGAL MOVE: still have to draw some cards');
            // alert('draw a card first dumbass'); 
            valid = false; 
          } else {
            console.log('LEGAL MOVE, go ahead'); 
          }
          
          if (valid) {

            if(card.color === 'any'){
              alert('choose color');
              // pop up 4 different colored buttons
              
              // user click on button. the button has a dataset with color data
              // set cur_color to button.dataset.color
            }
            state.player_turn = 'Z'; 
            const card = event.target.dataset;
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
                }),
              }); 

            let res = await res_head.json(); 
            // console.log(res);
          }
        } else {
          console.log('not your turn!!!');
          alert("not your turn, noodle head!!!");
        }
    });
  }
export default event_listeners; 