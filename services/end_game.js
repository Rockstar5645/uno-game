let Game = require('../models/games');
let Cards = require('../models/cards');
let Players = require('../models/players');

let get_total_points = (cards) => {
    let total = 0;
    cards.forEach((card) => {
        switch (card.name) {
            case '1':
                total += 1;
                break;

            case '2':
                total += 2;
                break;

            case '3':
                total += 3;
                break;

            case '4':
                total += 4;
                break;

            case '5':
                total += 5;
                break;

            case '6':
                total += 6;
                break;

            case '7':
                total += 7;
                break;

            case '8':
                total += 8;
                break;

            case '9':
                total += 9;
                break;

            case 'wild':
                total += 50;
                break;

            case 'draw_2':
                total += 20;
                break;

            case 'reverse':
                total += 20;
                break;

            case 'skip':
                total += 20;
                break;

            case 'draw_4':
                total += 50;
                break;
        }
    });
    return total;
};

let calculate_finals = async (user_id) => {

    let game_id = await Game.get_game_id(user_id);

    let get_next = (player_tag) => {
        switch (player_tag) {
            case "A":
                return "B";
            case "B":
                return "C";
            case "C":
                return "D";
            case "D":
                return "A";
        }
    };

    let curr_player = 'A';
    let player_hands = [];
    do {
        player_hands.push(await Cards.get_cards_for_players(curr_player, game_id));
        curr_player = get_next(curr_player);
    } while (curr_player !== 'A');

    let players_totals = [];

    curr_player = 'A';

    for (let i = 0; i < 4; i++) {

        let username = await Players.get_username_from_player_tag(curr_player, game_id);
        players_totals.push({
            username,
            player_tag: curr_player,
            total_points: get_total_points(player_hands[i]),
        });
        curr_player = get_next(curr_player);
    }

    players_totals.sort((a, b) => (a.total_points > b.total_points) ? 1 : -1);
    await Game.delete_game(game_id);

    return players_totals;
};

module.exports = {
    calculate_finals,
}; 