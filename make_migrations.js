require('dotenv').config();

let db = require('./db'); 


// create user table 
require('./migrations/create-users')(db); 

// create games tabe 

// create 10 dummy users
require("./migrations/dummy_users")(10);



