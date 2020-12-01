const db = require('../db');

const CREATE_GAME = `INSERT INTO games ("created_at") VALUES (now()) RETURNING id`;
const ADD_USER = `INSERT INTO players (game_id, user_id) VALUES ($1, $2) RETURNING game_id`;
const LOOKUP_CARDS = `SELECT * FROM deck`;
const INSERT_CARD = `INSERT INTO game_deck (game_id, name, color, "order", location) VALUES ($1, $2, $3, $4, $5)`;


const insertCards = (deck, gameId) => {
    console.log(">>>Inserting shuffled cards into game deck...");
    //console.log("The shuffled deck:\n", deck);

    return Promise.all(
        // at this point in game creation, the cards are already shuffled
        deck.map((card, index) => db.any(INSERT_CARD, [gameId, card.name, card.color, index, "draw_stack"]))
    ); 
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

const createGameDeck = (game) => {
    console.log(game); 
    console.log(">>>Creating a game deck...");
    return db
    .any(LOOKUP_CARDS)
    .then(shuffleCards)
    .then((deck) => {
        console.log('calling insert cards'); 
        return insertCards(deck, game.game_id); 
    }); 
};

let game_id; 

const create = (userIds) => {
    console.log("Creating a game. UserIds:", userIds);
    return db
        .one(CREATE_GAME)
        .then((game) => {
            game_id = game.id; 
            console.log(game);
            return Promise.all(
                // put each player in the database
                userIds.map((userId, index) => db.one(ADD_USER, [game.id, userId]))
            )
        }) 
        .then(arr => {
            return createGameDeck(arr[0]); 
        })
        .then(arr => {
            console.log('returned array');
            //console.log(arr); 
            return game_id; 
        });
};

module.exports = {
    create,
    // addUser,
    // getGameInfo,
    // getLobbyListing,
};