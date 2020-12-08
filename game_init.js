require("dotenv").config();

let { create_game_test, delete_game_test } = require('./test/games.js'); 

(async () => {

    await delete_game_test(); 
    await create_game_test(); 

})(); 