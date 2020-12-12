const db = require('../db');

const insertCards = async (deck, gameId) => {
    //console.log(">>>Inserting shuffled cards into game deck...");
    //console.log("The shuffled deck:\n", deck);

    const INSERT_CARD = `INSERT INTO game_deck (game_id, name, color, "order", location) VALUES ($1, $2, $3, $4, $5)`;
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

    const LOOKUP_CARDS = `SELECT * FROM deck`;
    let cards = await db.any(LOOKUP_CARDS);
    let deck = shuffleCards(cards);
    let fcn = deck[28].name; // first card name 

    while (fcn === 'wild' || fcn === 'draw_2' || fcn === 'draw_4'
        || fcn === 'skip' || fcn === 'reverse') {
        // make sure the first card isn't a special card 
        console.log('we got a special card', deck[28], 'reshuffling');
        deck = shuffleCards(cards);
        fcn = deck[28].name;
    }

    await insertCards(deck, game_id);
    return;
};

const create_game = async () => {
    //console.log("Creating a game. UserIds:", userIds);

    const CREATE_GAME = `INSERT INTO games 
        ("created_at", "top_card", "player_turn", "turn_direction") 
        VALUES (now(), 0, 'A', 'F') RETURNING id`;
    let game = await db.one(CREATE_GAME);
    let game_id = game.id;
    await createGameDeck(game_id);
    return game_id;
};

let get_game_id = async (player_id) => {

    const GET_GAME_ID = `SELECT game_id FROM players WHERE user_id=($1)`;
    let res = await db.one(GET_GAME_ID, player_id);
    return res.game_id;
};

let get_player_count = async (game_id) => {

    const GET_PLAYER_COUNT = `SELECT COUNT(*) FROM players WHERE game_id=($1)`;
    let player_count = await db.one(GET_PLAYER_COUNT, game_id);
    return parseInt(player_count.count, 10);
};

let get_players_in_queue = async () => {

    const GET_LATEST_GAME = `SELECT id FROM games ORDER BY id DESC LIMIT 1`;
    let game_id = await db.oneOrNone(GET_LATEST_GAME);

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
        return { count: 0 };
    }
};

let insert_into_session = async (game_id, user_id, player_tag) => {

    const ADD_USER = `INSERT INTO players (game_id, user_id, player_tag) 
                        VALUES ($1, $2, $3) RETURNING game_id`;
    let res = await db.one(ADD_USER, [game_id, user_id, player_tag]);
    return res;
}

let get_players = async (game_id) => {

    const GET_PLAYERS = `SELECT * FROM players WHERE game_id=($1)`;
    let res = await db.manyOrNone(GET_PLAYERS, game_id);
    return res;
};

const get_player_info = async (player_tag, game_id) => {
    const GET_PLAYER_INFO = `SELECT players.*, users.username, users.avatar 
                        FROM players 
                        INNER JOIN users 
                        ON users.user_id=players.user_id 
                        WHERE player_tag=$1 and game_id=$2`;
    let res = await db.one(GET_PLAYER_INFO, [player_tag, game_id]);
    return res;
}


let set_top = async (top, game_id) => {

    const SET_TOP = `UPDATE games SET top_card=($1) WHERE id=($2)`;
    await db.none(SET_TOP, [top, game_id]);
};

let set_current_color = async (color_chosen, game_id) => {
    const SET_CURR_COLOR = `UPDATE games SET current_color=($1) WHERE id=($2)`;
    await db.none(SET_CURR_COLOR, [color_chosen, game_id]);
};

let get_current_color = async (game_id) => {
    const GET_CURR_COLOR = `SELECT current_color FROM games WHERE id=($1)`;
    let res = await db.one(GET_CURR_COLOR, game_id);
    return res.current_color;
}

let get_player_tag = async (user_id, game_id) => {

    const GET_TAG = `SELECT player_tag FROM players WHERE user_id=($1) AND game_id=($2)`;
    let res = await db.one(GET_TAG, [user_id, game_id]);
    return res.player_tag;
};

let get_top = async (game_id) => {

    const GET_TOP = `SELECT top_card FROM games WHERE id=($1)`;
    let res = await db.one(GET_TOP, game_id);
    return res.top_card;
};


let get_turn_direction = async (game_id) => {
    const GTD = `SELECT turn_direction FROM games WHERE id=($1)`;
    let res = await db.one(GTD, game_id);
    return res.turn_direction;
};

let set_turn_direction = async (game_id, next_turn_direction) => {
    const STD = `UPDATE games SET turn_direction=($1) WHERE id=($2)`;
    await db.none(STD, [next_turn_direction, game_id]);
}

let get_player_turn = async (game_id) => {
    const GPT = `SELECT player_turn FROM games WHERE id=($1)`;
    let res = await db.one(GPT, game_id);
    return res.player_turn;
};

let set_player_turn = async (game_id, next_player) => {
    const SPT = `UPDATE games SET player_turn=($1) WHERE id=($2)`;
    await db.none(SPT, [next_player, game_id]);
};

let get_current_card = async (game_id) => {
    // only works if called when initializing the game. it's useless afterwards
    const GET_CURRENT_CARD_ID = `SELECT current_card from games WHERE id=($1)`;
    let res = await db.one(GET_CURRENT_CARD_ID, game_id);

    const GET_STARTING_CARD = `SELECT * FROM game_deck WHERE id=($1)`;
    var cur_card = await db.one(GET_STARTING_CARD, res.current_card);
    return cur_card;
};

let update_current_card = async (game_id, card_id) => {

    const UCC = `UPDATE games SET current_card=($1) WHERE id=($2)`;
    await db.none(UCC, [card_id, game_id]);
};

let get_players_in_game = async (game_id) => {

    const GET_PLAYERS = `SELECT players.user_id, players.player_tag, 
                            users.username, users.avatar 
                            FROM players INNER JOIN users 
                            ON users.user_id=players.user_id
                            WHERE game_id=($1)    
                        `;

    let player_map = await db.manyOrNone(GET_PLAYERS, game_id);

    for (let i = 0; i < player_map.length; i++) {
        const GET_CARD_COUNT = `SELECT COUNT(*) FROM game_deck WHERE location=($1) AND game_id=($2)`;
        let res = await db.one(GET_CARD_COUNT, [player_map[i].player_tag, game_id]);
        // console.log(res); 
        player_map[i].card_count = parseInt(res.count, 10);
    }

    return player_map;
}

module.exports = {
    get_players_in_game,
    create_game,
    get_game_id,
    get_player_count,
    get_players_in_queue,
    insert_into_session,
    get_players,
    set_top,
    get_player_tag,
    get_top,
    update_current_card,
    get_turn_direction,
    set_turn_direction,
    get_player_turn,
    set_player_turn,
    get_player_info,
    get_current_card,
    set_current_color,
    get_current_color,
};