const db = require("../db/index");
const RANKINGS =
    "SELECT username, avatar, scores FROM users ORDER BY scores DESC LIMIT 10";
// const MESSAGES = "SELECT message, user_id FROM lobby_messages";
const LOBBY_MESSAGES =
    "SELECT lobby_messages.message, lobby_messages.user_id, users.username FROM lobby_messages, users WHERE users.user_id = lobby_messages.user_id";
const SELECT_USER_FROM_MESSAGE = "SELECT * FROM users WHERE user_id = $1";
const USERNAME = "SELECT username FROM users WHERE user_id = $1";
const INSERT_MESSAGE =
    "INSERT INTO lobby_messages(user_id, message) Values($1, $2) RETURNING message";

// let getLobbyMessage = (lobbyMessage) =>
//     db.one(USERNAME, lobbyMessage.user_id).then((user) => {
//         let message = {
//             username: user.username,
//             text: lobbyMessage.message,
//         };
//         // console.log(message);
//         return message;
//     });

const lobbySendMessage = (userId, message) =>
    db.one(INSERT_MESSAGE, [userId, message]).then((result) => {
        console.log(result);
    });

// return lobby info
const lobbyInfo = (_) =>
    Promise.all([db.any(RANKINGS), db.any(LOBBY_MESSAGES)]).then(
        ([users, lobbyMessages]) => {
            // let messages = lobbyMessages.map(getLobbyMessage);
            return { users, lobbyMessages };
        }
    );

module.exports = {
    lobbyInfo,
    lobbySendMessage,
};