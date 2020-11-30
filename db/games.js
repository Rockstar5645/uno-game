// const db = require("./index");

// const CREATE_GAME = `INSERT INTO games ("createdAt") VALUES (now()) RETURNING id`;
// const ADD_USER = `INSERT INTO game_users (game_id, user_id, "order") VALUES ($1, $2, $3) RETURNING game_id`;
// const GET_LAST_USER = `SELECT * FROM game_users WHERE game_id=$1 ORDER BY "order" DESC LIMIT 1`;
// const LOOKUP_CARDS = `SELECT * FROM deck`;
// const INSERT_CARD = `INSERT INTO game_deck (game_id, card_id, "order") VALUES ($1, $2, $3)`;
// const GET_DECK =
//   "SELECT * FROM game_deck, deck WHERE game_id=$1 AND game_deck.card_id=deck.id";
// const GET_OPEN_GAMES =
//   "SELECT games.*, COUNT(game_users.user_id) AS player_count FROM games, game_users WHERE games.id=game_users.game_id GROUP BY games.id";

// const shuffleCards = (deck) => {
//   let currentIndex = deck.length,
//     temporaryValue,
//     randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = deck[currentIndex];
//     deck[currentIndex] = deck[randomIndex];
//     deck[randomIndex] = temporaryValue;
//   }

//   return deck;
// };

// const insertCards = (gameId) => (deck) =>
//   Promise.all(
//     deck.map((card, index) => db.any(INSERT_CARD, [gameId, card.id, index]))
//   );

// const createGameDeck = (game) =>
//   db
//     .any(LOOKUP_CARDS)
//     .then(shuffleCards)
//     .then(insertCards(game.game_id))
//     .then(() => game.game_id);

// const create = (userId) => {
//   return db
//     .one(CREATE_GAME)
//     .then((game) => db.one(ADD_USER, [game.id, userId, 0]))
//     .then(createGameDeck);
// };

// const GET_GAME_INFO = "SELECT * FROM games WHERE id=$1";

// const GET_USERS =
//   "SELECT users.email, users.username, users.id FROM games, users, game_users WHERE games.id=game_users.game_id AND users.id=game_users.user_id AND games.id=$1";

// const getGameInfo = (gameId) =>
//   Promise.all([
//     db.one(GET_GAME_INFO, [gameId]),
//     db.any(GET_USERS, [gameId]),
//     db.any(GET_DECK, [gameId]),
//   ]).then(([gameInfo, users, deck]) => {
//     return {
//       ...gameInfo,
//       users,
//       deck,
//     };
//   });

// // const addUser = (gameId, userId) =>
// //   db
// //     .one(GET_LAST_USER, [gameId])
// //     .then((lastUser) => db.one(ADD_USER, [gameId, userId, lastUser.order + 1]));

// const getLobbyListing = () => db.any(GET_OPEN_GAMES);

// module.exports = {
//   create,
//   // addUser,
//   // getGameInfo,
//   // getLobbyListing,
// };
