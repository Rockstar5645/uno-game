require('dotenv').config();

let db = require('./db'); 

// create user table 
require('./migrations/create-users')(db); 


