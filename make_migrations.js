require('dotenv').config();

let db = require('./db');


// create user table 
require('./migrations/create-users')(db);

// create deck table
require('./migrations/create-deck')(db);

<<<<<<< HEAD
// create games table 
require('./migrations/create-games')(db);
=======
// create 10 dummy users
require("./migrations/dummy_users")(10);
>>>>>>> 147c2085987d24e3a54ca68320ee3181f39b43b5

// create players table
require('./migrations/create-players')(db);

// create draw stacks table

// create played stacks table

// create player_a_hands table

// create player_b_hands table

// create player_c_hands table

// create player_d_hands table

