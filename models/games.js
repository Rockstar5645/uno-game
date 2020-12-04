const db = require('../db');

const CREATE_GAME = `INSERT INTO games ("created_at") VALUES (now()) RETURNING id`;
const ADD_USER = `INSERT INTO players (game_id, user_id) VALUES ($1, $2) RETURNING game_id`;
const LOOKUP_CARDS = `SELECT * FROM deck`;
const INSERT_CARD = `INSERT INTO game_deck (game_id, name, color, "order", location) VALUES ($1, $2, $3, $4, $5)`;


const insertCards = async (deck, gameId) => {
    //console.log(">>>Inserting shuffled cards into game deck...");
    //console.log("The shuffled deck:\n", deck);

    for (let index = 0; index < deck.length; index++) {
        let card = deck[index]; 
        await db.any(INSERT_CARD, [gameId, card.name, card.color, index, "draw_stack"]); 
    }
    return; 
};


const shuffleCards = (deck) => {
    //console.log(">>>Shuffling cards...");

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

const createGameDeck = async (game_id) => {
    //console.log(game_id); 
    //console.log(">>>Creating a game deck...");
    
    let cards = await db.any(LOOKUP_CARDS); 
    let deck = shuffleCards(cards);
    await insertCards(deck, game_id); 
    return; 
};

const create_game = async () => {
    //console.log("Creating a game. UserIds:", userIds);

    let game = await db.one(CREATE_GAME); 
    let game_id = game.id; 
    await createGameDeck(game_id); 
    return game_id; 
};

let get_game_id = async (player_id) => {

    const GET_GAME_ID = `SELECT game_id FROM players WHERE user_id=($1)`; 
    let game_id = await db.one(GET_GAME_ID, player_id); 
    return game_id.game_id; 
}

let get_player_count = async (game_id) => {

    const GET_PLAYER_COUNT = `SELECT COUNT(*) FROM players WHERE game_id=($1)`; 
    let player_count = await db.one(GET_PLAYER_COUNT, game_id);
    console.log('the number of players in game ', game_id, ' is ', player_count); 
    return parseInt(player_count.count, 10); 
}

let get_players_in_queue = async () => {

    const GET_LATEST_GAME = `SELECT id FROM games ORDER BY id DESC LIMIT 1`;
    let game_id = await db.oneOrNone(GET_LATEST_GAME); 

    console.log('latest game id', game_id); 
    
    if (game_id) {
        // a game session exists
        game_id = game_id.id; 
        let player_count = await get_player_count(game_id); 
        return {
            count: player_count, 
            game_id: game_id
        }; 
    } else {
        // it doesnt exist
        console.log('no games exist yet'); 
        return {count: 0};
    }
}

let insert_into_session = async(game_id, user_id) => {
    
    let res = await db.one(ADD_USER, [game_id, user_id]); 
    return res; 
}

module.exports = {
    create_game,
    get_game_id,
    get_player_count,
    get_players_in_queue, 
    insert_into_session, 
    // addUser,
    // getGameInfo,
    // getLobbyListing,
};