// Create dummy user
const User = require("./user");

module.exports = (n) => {
    // Generate n users with random wins and losses
    let usernameTemp = "TestUser";
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
        User.create(
            username=username, 
            password=password, 
            confirmPassword=password, 
            email=email, 
            wins=wins, 
            losses=losses,
            scores=scores
            );
    }
}

