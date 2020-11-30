require('dotenv').config();

let db = require('./db');

// careful when adding routes. order matters for tables referencing other tables

(async function () {
    console.log(">>> Creating migrations...");
    try {
        // DROP all TABLES before creating new migrations
        await require('./clean_db')(db);

        // create user table 
        await require('./migrations/create-users')(db);

        // create deck table
        await require('./migrations/create-deck')(db);

        // create games table 
        await require('./migrations/create-games')(db);

        // creat games_deck table
        await require("./migrations/create-game_deck")(db); // child of games

        // create players table
        await require('./migrations/create-players')(db); // child of users and games

        // create 10 dummy users
        await require("./migrations/dummy_users")(10);
    }
    catch (e) {
        console.log("Error creating migrations:", e);
    }
})().then(() => console.log(">>> Migrations created successfully!"));



// create draw stacks table

// create played stacks table

// create player_a_hands table

// create player_b_hands table

// create player_c_hands table

// create player_d_hands table
