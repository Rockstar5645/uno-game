let Deck = require('../models/deck.js');

const ACTION_MAP = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "draw_2",
    "reverse",
    "skip",
];

const COLORS = ["red", "yellow", "green", "blue"];
const ACTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

module.exports = async function () {
    for (let ci = 0; ci < 4; ci++) {

        for (let i = 0; i <= 12; i++) {
            await Deck.insert_card(ACTION_MAP[i], COLORS[ci], i);
        }

        for (let i = 1; i <= 12; i++) {
            await Deck.insert_card(ACTION_MAP[i], COLORS[ci], i);
        }

        await Deck.insert_card("wild_draw_4", "any", 13);
        await Deck.insert_card("wild", "any", 14);
    }
}