const db = require('../db');

const GET_USER_IDS = `SELECT user_id FROM players WHERE game_id=$1`;
const GET_USER_DATA = `SELECT * FROM users WHERE user_id=$1 or user_id=$2 or user_id=$3 or user_id=$4;`
// const GET_PLAYER_A_CARDS = `SELECT * FROM game_deck WHERE user_id=$1 and game_id=$2 and location=$3`;
const GET_GAME_DECK = `SELECT * FROM game_deck`;
const GET_PLAYERS = `SELECT * FROM players`;
// /games/:game_id
exports.startGame = async (req, res) => {
    var { game_id, user_id } = req.params;
    console.log("helpers/games: startGame: Rendering game. ID:", game_id);

    // need to render player names

    try {
        // get user id's so we can get the player data
        console.log("...Getting user IDs");
        var user_ids = await db.any(GET_USER_IDS, game_id);
        // console.log("user_ids:", user_ids);

        // get player data to render each player's name and avatar (from users table)
        console.log("...Getting users' data");
        var users = await db.any(GET_USER_DATA, [user_ids[0].user_id, user_ids[1].user_id, user_ids[2].user_id, user_ids[3].user_id]);
        // console.log("players:", players);

        // get the players (from players table)
        console.log("...Getting players");
        var players = await db.any(GET_PLAYERS)

        // render player cards
        console.log("...Getting player's initial cards");
        // var cards = await db.any(GET_PLAYER_A_CARDS, [user_ids[0].user_id, game_id, "player_a_hand"]);
        var cards = await db.any(GET_GAME_DECK);
    } catch (e) {
        console.log("Error in route /games/:game_id, startGame() helper.");
        console.log(e);
    }

    // get the data for the main player (to be displayed at bottom of screen)
    var main_player = {
        id,
        game_id: game_id,
        user_id: user_id,
        uno_status,
        player,
        username,
        avatar,
        cards =[]
    }

    users.forEach(user => {
        if (user.id === user_id) {
            main_player.avatar = user.avatar;
            main_player.username = user.username;
        }
    });

    players.forEach(player => {
        if (player.user_id == user_id) {
            main_player.id = player.id;
            main_player.uno_status = player.uno_status;
            main_player.player = player.player;
        }
    });

    cards.forEach(card => {
        if (card.location === `player_${main_player.player}_hand`) {
            main_player.cards.push(card);
        }
    });

    console.log("Main player info:", main_player);
    // render current_card
    res.render("game_board", { players, cards, main_player });
}

module.exports = exports;

// user_ids example:
// user_ids: [ { user_id: 1 }, { user_id: 2 }, { user_id: 3 }, { user_id: 4 } ]

// players example:
// players: [
//     {
//       user_id: 1,
//       username: 'tu0',
//       password: '$2b$12$/eLcdQxV31jZhwikJV25V.yL5uAv5qHT4ZeLbROHRTbtB.fHQmPgu',
//       email: 'tu0@gmail.com',
//       avatar: '/images/avatars/avatar-flat-32.png',
//       wins: 0,
//       losses: 0,
//       scores: 0
//     },
//          ....
//     {
//       user_id: 4,
//       username: 'tu3',
//       password: '$2b$12$122vRAmIA2inw/dKnJGmmejP0x8FTZafsgjGNH9DiWpQgt/COVrJG',
//       email: 'tu3@gmail.com',
//       avatar: '/images/avatars/avatar-flat-8.png',
//       wins: 47,
//       losses: 50,
//       scores: 285
//     }
//   ]