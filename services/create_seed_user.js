
let User = require("../models/user");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

module.exports = async function(username, password, email, wins, losses, scores) {

    let hash = await bcrypt.hash(password, SALT_ROUNDS); 

    await User.create(
        username=username, 
        password=hash, 
        email=email, 
        wins=wins, 
        losses=losses,
        scores=scores
    );
}