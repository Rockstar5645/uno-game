require("dotenv").config();

const GameTest = require('./tests/games'); 
const Cards = require('./models/cards'); 
const serviceCards = require('./services/cards'); 
const Games = require('./models/games'); 
const Players = require('./models/players'); 

const play_card = require('./tests/play_card'); 

(async () => {

    if (process.argv.length > 2) {
        
        let arg = process.argv[2]; 
        switch (arg) {
            case 'cg':
                console.log('creating game'); 
                await GameTest.delete_game_test(); 
                await GameTest.create_game_test(); 
                break; 

            case 'pc':
                console.log('playing card'); 
                let player_tag = process.argv[3]; 
                await play_card(player_tag); 
                break; 
        }
    }

    let res = await serviceCards.allowed_to_play(6, 'D'); 
    console.log(res); 

    // let res = await Cards.get_card_id(28, 25); 
    // console.log(res); 

    // await Games.update_current_card(25, 677);

    // const arr = [ 'A', 'B', 'C', 'D' ];

    // let div = Math.floor(17 / 7); 
    // console.log(div); 
    // console.log(arr[Math.floor(17 / 7)]); 

    // let res = await get_players(2); 
    // console.log(res); 

    // await deal_cards(2); 

    // let res = await get_card_with_order(10); 
    // console.log(res); 

    // let res = await draw_cards(7, 10);
    // console.log(res); 

    // await update_current_card(15, 1); 

    // console.log(await get_turn_direction(1)); 
    // console.log(await get_player_turn(1)); 

    // await set_player_turn(1, 'D');
    // console.log(await get_gid_from_card(1)); 

    // await change_card_location_to_played(3);

    // console.log(await play_card(14)); 

    // let turn_direction = 'R';
    // let next_turn_direction = (turn_direction === 'F' ? 'R' : 'F');
    // console.log(next_turn_direction); 

    // await reverse_direction(1);

    //await skip_turn(1); 

    // console.log(await play_card(137)); 
})(); 
