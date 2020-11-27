require('dotenv').config();

let db = require('./db');

// create user table 
require('./migrations/create-users')(db);

// create deck table
require('./migrations/create-deck')(db);

// create games table 
require('./migrations/create-games')(db);

// create players table
require('./migrations/create-players')(db);

// create draw stacks table

// create played stacks table

// create player_a_hands table

// create player_b_hands table

// create player_c_hands table

// create player_d_hands table

