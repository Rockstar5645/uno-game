const db = require('../db');

const CREATE_GAME = `INSERT INTO games ("created_at") VALUES (now()) RETURNING id`;
const ADD_USER = `INSERT INTO players (game_id, user_id) VALUES ($1, $2) RETURNING game_id`;
const LOOKUP_CARDS = `SELECT * FROM deck`;
const INSERT_CARD = `INSERT INTO game_deck (game_id, name, color, "order") VALUES ($1, $2, $3, $4)`;


const insertCards = (gameId) => (deck) => {
    console.log(">>>Inserting shuffled cards into game deck...");
    Promise.all(
        // at this point in game creation, the cards are already shuffled
        deck.map((card, index) => db.any(INSERT_CARD, [gameId, card.name, card.color, index]))
    ).catch((e) => console.log("Error inserting cards.", e));
};


const shuffleCards = (deck) => {
    console.log(">>>Shuffling cards...");

    let currentIndex = deck.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = temporaryValue;
    }
    // console.log("The shuffled deck:\n", deck);
    return deck;
};

const createGameDeck = (gameId) => {
    console.log(">>>Creating a game deck...");
    db
        .any(LOOKUP_CARDS)
        .then(shuffleCards)
        .then(insertCards(game.game_id))
        .then(() => game.game_id)
        .catch((e) => console.log("Error creating game deck.", e));
};

const create = (userIds) => {
    console.log("Creating a game. UserIds:", userIds);
    return db
        .one(CREATE_GAME)
        .then((game) => {
            userIds.forEach(userId => db.one(ADD_USER, [game.id, userId]))
        }).then(createGameDeck);
};

module.exports = {
    create,
    // addUser,
    // getGameInfo,
    // getLobbyListing,
};