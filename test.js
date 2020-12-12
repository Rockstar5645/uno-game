require("dotenv").config();

const GameTest = require('./tests/games');
const Cards = require('./models/cards');
const serviceCards = require('./services/cards');
const Games = require('./models/games');
const Players = require('./models/players');
const serviceGames = require('./services/games');
const User = require('./models/user');
const serviceUser = require('./services/users');

(async () => {

    if (process.argv.length > 2) {
        let arg = process.argv[2];
        switch (arg) {
            case 'cg':
                console.log('creating game');
                await GameTest.delete_game_test();
                await GameTest.create_game_test();
                break;

            case 'ch':
                // console.log('making A all draw 2'); 
                // await GameTest.change_hand('A', 'draw_2'); 
                await GameTest.change_hand('B', 'reverse');
                break;

            case 'pc':
                console.log('playing card');
                let player_tag = process.argv[3];
                await play_card(player_tag);
                break;
        }

    } else {
        let res = await User.check_game(3);
        console.log(res);
    }
})(); 
