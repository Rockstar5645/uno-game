let Deck = require('../models/deck.js'); 

const ACTION_MAP = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "draw two",
    "reverse",
    "skip",
  ];
  
  const COLORS = ["red", "yellow", "green", "blue"];
  const ACTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  module.exports = async function() {
      for (let ci = 0; ci < 4; ci++) {

        for (let i = 0; i <= 12; i++) {
            await Deck.insert_card(ACTION_MAP[i], COLORS[ci], i);
        }

        for (let i = 1; i <= 12; i++) {
            await Deck.insert_card(ACTION_MAP[i], COLORS[ci], i); 
        }

        await Deck.insert_card("draw four", "any", 13); 
        await Deck.insert_card("wild", "any", 14); 
      }
  }