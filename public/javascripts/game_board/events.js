import Util from '../util.js';

let event_listeners = () => {

    let socket = io();
    let user_id = Util.getCookie('user_id'); 

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
} 

export default event_listeners; 