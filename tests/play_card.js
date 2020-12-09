const Cards = require('../models/cards');
const db = require('../db');
const sCards = require('../services/cards'); 

module.exports = async (player_tag) => {

    const GET_GAME = `SELECT id, player_turn FROM games`;
    let res = await db.one(GET_GAME);
    let game_id = res.id;

    if (res.player_turn !== player_tag) {
        console.log('Not this players turn, its ', res.player_turn);
        return; 
    }

    let cards = await Cards.get_cards_for_players(player_tag, game_id); 
    // console.log(cards); 

    let card_id = cards[0].id; 
    // console.log(card_id); 

    res = await sCards.play_card(card_id); 
    console.log('next_player', res); 

    // let hand = Cards.get_cards_for_players()

    // let res_head = await fetch(`/games/play-card`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify({ card, player_tag }),
    //   }); 
    
    // let res = await res_head.json(); 
    // console.log(res);

}; 