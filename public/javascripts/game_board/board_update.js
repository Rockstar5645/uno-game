import state from './state.js';


let change_turn_direction = () => {

    // redraw the turn image here
    console.log('reacing here, attempting to reverse turn direction image');
    if (state.turn_direction === 'F') {
        document.getElementById('turn-direction').style.transform = 'scaleX(1)';
    } else {
        document.getElementById('turn-direction').style.transform = 'scaleX(-1)';
    }
}
state.subscribe('turn_direction_change', change_turn_direction);

let change_played_card = () => {
    // console.log('changing played card to ', state.curr_card); 
    let curr_card = state.curr_card;
    let played_card = document.getElementById("played-card-id");
    played_card.src = `/images/uno_deck/${curr_card.color}_${curr_card.name}.png`;
    played_card.dataset.color = curr_card.color;
    played_card.dataset.name = curr_card.name;
};
state.subscribe('curr_card_change', change_played_card);

let change_player_turn = () => {

    let player_selector;
    for (let player_tag in state.player_map) {
        player_selector = state.player_map[player_tag];
        document.getElementById(player_selector).style.backgroundColor = 'transparent';
    }
    player_selector = state.player_map[state.player_turn];
    document.getElementById(player_selector).style.backgroundColor = 'orange';
}
state.subscribe('player_turn_change', change_player_turn);

let change_color = () => {
    let curr_color = state.curr_color;
    let curr_card = state.curr_card;
    if (state.player_turn === state.main_player && curr_card.color === 'any') {
        console.log('You have to player a ', curr_color, ' card');
        alert('You have to play a ' + curr_color + ' card');
    }
}
state.subscribe('curr_color_change', change_color);


let change_player_hand_count = () => {
    let hands_counts = state.other_players_hand_count;

    for (let player_tag in hands_counts) {
        let card_count = hands_counts[player_tag];
        let deck_id = state.deck_map[player_tag];
        let deck_select = document.getElementById(deck_id);

        while (deck_select.firstChild) {
            deck_select.removeChild(deck_select.lastChild);
        }

        for (let i = 0; i < card_count; i++) {
            let back_card = document.createElement("li");
            back_card.className = "user-card";

            let card_img = document.createElement("img");
            card_img.src = `/images/uno_deck/card_back.png`;

            back_card.append(card_img);
            deck_select.append(back_card);
        }
    }
};
state.subscribe('players_hand_count_change', change_player_hand_count);


let change_player_username = () => {

    let usernames = state.other_players_usernames;
    for (let player_tag in usernames) {
        let username = usernames[player_tag];
        let username_id = state.player_map[player_tag];
        let username_select = document.getElementById(username_id);

        username_select.innerHTML = username;
    }
};
state.subscribe('players_usernames_change', change_player_username);


let change_main_player_hand = () => {

    let main_cards = document.getElementById("main_player_deck");

    while (main_cards.firstChild) {
        main_cards.removeChild(main_cards.lastChild);
    }

    let player_hand = state.main_player_hand;

    for (let card_id in player_hand) {
        let card = player_hand[card_id];

        let card_item = document.createElement("li");
        card_item.className = "user-card";

        let card_img = document.createElement("img");
        card_img.src = `/images/uno_deck/${card.color}_${card.name}.png`;
        card_img.dataset.id = card.id;
        card_img.dataset.color = card.color;
        card_img.dataset.name = card.name;

        card_item.append(card_img);
        main_cards.append(card_item);
    }
};
state.subscribe('main_player_hand_change', change_main_player_hand);

export default {}; 