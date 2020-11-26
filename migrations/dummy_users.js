// Create dummy user
let User = require("../models/user");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

module.exports = async function (n) {
    // Generate n users with random wins and losses
    let usernameTemp = "TestUser";
    for(i = 0; i < n; i++) {
        let username = usernameTemp + i;
        let password = username;
        let hash = await bcrypt.hash(password, SALT_ROUNDS); 
        let email= username + "@gmail.com";
        // generate random wins in range (0, 100)
        let wins = Math.floor(Math.random() * 100);
        // generate random losses in range (0, 100)
        let losses = Math.floor(Math.random() * 100);
        // Winner gets 5 points, losers get 1 point
        let scores = wins * 5 + losses;
        User.create(
            username=username, 
            password=hash, 
            email=email, 
            wins=wins, 
            losses=losses,
            scores=scores
            );
        console.log(`Created user: ${username}, scores: ${scores}`);
    }
}

