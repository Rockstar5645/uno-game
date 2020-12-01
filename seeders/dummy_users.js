let create_seed_user = require('../services/create_seed_user.js'); 

// Create dummy user
module.exports = async function (n) {
    // Generate n users with random wins and losses
    let usernameTemp = "tu";
    for(i = 0; i < n; i++) {
        let username = usernameTemp + i;
        let password = username;
        
        let email= username + "@gmail.com";
        // generate random wins in range (0, 100)
        let wins = Math.floor(Math.random() * 100);
        // generate random losses in range (0, 100)
        let losses = Math.floor(Math.random() * 100);
        // Winner gets 5 points, losers get 1 point
        let scores = wins * 5 + losses;

        await create_seed_user(username, password, email, wins, losses, scores); 
        console.log(`Created user: ${username}, scores: ${scores}`);
    }
}

