require("dotenv").config();

let { create_game_test, delete_game_test } = require('./test/games.js'); 
let { change_card_location, get_cards_for_players, get_card_with_order } = require('./models/cards.js'); 
let { get_players, set_top, get_top, get_player_tag } = require('./models/games.js');

let { get_cards } = require('./services/cards'); 

let { deal_cards, draw_cards } = require('./services/cards'); 

(async () => {

    //await create_game_test(); 

    // await delete_game_test(1); 
    
    
    // const arr = [ 'A', 'B', 'C', 'D' ];

    // let div = Math.floor(17 / 7); 
    // console.log(div); 
    // console.log(arr[Math.floor(17 / 7)]); 

    // let res = await get_players(2); 
    // console.log(res); 

    // await deal_cards(2); 

    // let res = await get_card_with_order(10); 
    // console.log(res); 

    let res = await draw_cards(7, 10);
    console.log(res); 
})(); 
