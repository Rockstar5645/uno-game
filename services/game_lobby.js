
let User = require('../models/users.js'); 

let player_one = User.get(12); 

player_one.add_to_game(15);