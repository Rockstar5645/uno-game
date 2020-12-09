require("dotenv").config();

let GameTest = require('./test/games.js'); 

(async () => {

    await GameTest.delete_game_test(); 
    await GameTest.create_game_test(); 

})(); 