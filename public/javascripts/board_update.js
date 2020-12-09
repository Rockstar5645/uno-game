

let played_card_update = (cur_card, player_tag, main_player, deck_map) => {
    let played_card = document.getElementById("played-card-id"); 
    played_card.src = `/images/uno_deck/${cur_card.color}_${cur_card.name}.png`;

    if (player_tag !== main_player) {
        // we'll remove the back card from their set 
        console.log('removing back card for player_tag', player_tag); 
        let container_selector = deck_map[player_tag]; 
    
        let player_container = document.getElementById(container_selector); 
        let backCard = player_container.firstChild; 
        backCard.remove(); 
    } else {
        console.log('on the main player now no need to remove anything'); 
    }
}; 

let play_card = async (event, main_player) => {
    
    const card = event.target.dataset;
    console.log("playing card:", card); 
    // console.log("testing to see if I have access to the cur_card global variable in game_board:", cur_card);
    

    event.target.parentNode.remove(); 

    let res_head = await fetch(`/games/play-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ card, main_player }),
      }); 

    let res = await res_head.json(); 
    console.log(res);
}; 

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

let change = (obj) => {
    obj.something = '5'; 
}; 


export default {
    played_card_update, 
    play_card, 
    get_next,
    change, 
}; 