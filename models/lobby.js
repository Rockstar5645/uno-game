const { raw } = require("express");
const db = require("../db/index");
const RANKINGS =
    "SELECT username, avatar, scores FROM users ORDER BY scores DESC LIMIT 10";
// const MESSAGES = "SELECT message, user_id FROM lobby_messages";
const LOBBY_MESSAGES =
    "SELECT lobby_messages.message, lobby_messages.user_id, users.username, users.avatar FROM lobby_messages, users WHERE users.user_id = lobby_messages.user_id";
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
const lobbyInfo = (req) =>
    Promise.all([db.any(RANKINGS), db.any(LOBBY_MESSAGES)]).then(
        ([users, lobbyMessages]) => {
            let user = parseCookies(req.headers.cookie);
            // let messages = lobbyMessages.map(getLobbyMessage);
            return { users, lobbyMessages, user };
        }
    );

// Parse strings to dictionary
function parseCookies(cookies) {
    let rawCookies = cookies.split("; ").map(cookie => cookie.split("="));
    var cookiesJson = {};
    for (var i in rawCookies) {
        cookie = rawCookies[i]
        cookiesJson[cookie[0]] = cookie[1];
    }
    return cookiesJson;
}

module.exports = {
    lobbyInfo,
    lobbySendMessage,
};
