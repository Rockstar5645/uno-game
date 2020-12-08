const Game = require('../models/games');
const Cards = require('../models/cards');

let game_board_init = async (game_id, user_id) => {

    // console.log("services/game_board: startGame: Game ID:", game_id, 'User ID:', user_id);

    try {
        // get all players's data
        let player_a = await Game.get_player_info('A', game_id);
        let player_b = await Game.get_player_info('B', game_id);
        let player_c = await Game.get_player_info('C', game_id);
        let player_d = await Game.get_player_info('D', game_id);

        player_a.cards = await Cards.get_cards_for_players('A', game_id);
        player_b.cards = await Cards.get_cards_for_players('B', game_id);
        player_c.cards = await Cards.get_cards_for_players('C', game_id);
        player_d.cards = await Cards.get_cards_for_players('D', game_id);

        // console.log("players:", player_a, player_b, player_c, player_d);

        // find who main player is
        let main_player_tag = await Game.get_player_tag(user_id, game_id);
        // console.log("main player tag:", main_player_tag);

        // get currrent card and pass it to view
        let cur_card = await Game.get_starting_card(game_id);
        // console.log("current card in play:", cur_card);

        await Game.update_current_card(game_id, cur_card.id);

        return {
            status: 'success', 
            res: {
                player_a,
                player_b,
                player_c,
                player_d,
                main_player_tag,
                cur_card, 
            }, 
        };

    } catch (e) {
        console.log("Error in route /games/:game_id, startGame() helper.");
        console.log(e);
        return {
            status: 'error', 
        }
    }
}; 

let handle_socket = async (msg, cb) => {

    switch(msg.op) {
        case 'get_main': 
            let user_id = msg.user_id; 
            let game_id = await Game.get_game_id(user_id); 

            let players = await Game.get_players_in_game(game_id); 
            let init_game_board_state = {}; 

            players.forEach((player) => {
                init_game_board_state[player.player_tag] = player;
            }); 

            let main_player_tag = await Game.get_player_tag(user_id, game_id);
            init_game_board_state.main_player = main_player_tag;

            init_game_board_state[main_player_tag].cards = 
                            await Cards.get_cards_for_players(main_player_tag, game_id);

            let cur_card = await Game.get_starting_card(game_id);

            init_game_board_state.cur_card = cur_card; 

            cb(init_game_board_state);
            break;   
    }
}; 

module.exports = {
    game_board_init, 
    handle_socket, 
}