const USERS = "SELECT * FROM users";
const INSERT_MESSAGE =
    "INSERT INTO lobby_messages(user_id, message) Values($1, $2) RETURNING message";
let messages = [
    "Let's play one more game",
    "Nice game",
    "Hah I won again!",
    "Does anyone here want to join us?",
    "Uno does manage to deliver the basic elements of the card game very well.",
];

// Create dummy lobby messages
// set default input number = 10 if no input
module.exports = (db, n = 10) => {
    db.any(USERS).then((users) => {
        for (i = 0; i < n; i++) {
            // get a random user from existing users.
            let userIndex = Math.floor(Math.random() * users.length);
            // get a random message from messages.
            let messageIndex = Math.floor(Math.random() * messages.length);
            db.one(INSERT_MESSAGE, [
                users[userIndex].user_id,
                messages[messageIndex],
            ])
                .then((message) => {
                    console.log(`INSERTED MESSAGE: ${message.message}`);
                })
                .catch((e) => {
                    console.log("Something went wrong With inserting message");
                    console.log(e);
                });
        }
    });
};
