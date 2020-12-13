

class State {

    constructor() {
        this.player_turn = 'A';
        this.main_player = 'A';
        this.turn_direction = 'F';
        this.curr_card = {};
        this.curr_color = 'blue';
        this.user_id_map = {};      // maps the user_id to username 
        this.player_map = {};       // maps the player tag to the username element id
        this.deck_map = {};         // maps the player tag to the deck id 
        this.events = {};
        this.main_player_hand = {}              // maps the card_id to the card object
        this.other_players_hand_count = {};     // maps the player_tag to the number of cards in hand 
        this.other_players_usernames = {};
        this.to_draw = 0;       // the number of cards the player must draw before they can play 
    }

    set_turn_direction(td) {
        if (td !== this.turn_direction) {
            this.turn_direction = td;
            this.publish('turn_direction_change');
        }
    }

    set_main_player_hand(cards) {
        this.main_player_hand = cards;
        this.publish('main_player_hand_change');
    }

    set_player_turn(pt) {
        this.player_turn = pt;
        this.publish('player_turn_change');
    }

    set_other_players_hand_count(counts) {
        this.other_players_hand_count = counts;
        this.publish('players_hand_count_change');
    }

    set_other_players_usernames(usernames) {
        this.other_players_usernames = usernames;
        this.publish('players_usernames_change');
    }

    set_curr_card(card) {
        this.curr_card = card;
        // console.log('setting current card and publishing ', card); 
        this.publish('curr_card_change');
    }

    set_curr_color(color) {
        this.curr_color = color;
        this.publish('curr_color_change');
    }

    subscribe(event, callback) {
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        return this.events[event].push(callback);
    }

    publish(event) {
        if (!this.events.hasOwnProperty(event)) {
            return [];
        }
        return this.events[event].map(callback => callback());
    }
}

export default new State(); 