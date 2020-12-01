"use strict";

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


module.exports = {
  up: (queryInterface, Sequelize) => {
    const deck = COLORS.reduce((accumulator, color) => {
      return [
        ...accumulator,
        ...ACTIONS.map((actionId) => ({
          name: ACTION_MAP[actionId],
          color,
          action: actionId,
        })),
        ...ACTIONS.slice(1).map((actionId) => ({
          name: ACTION_MAP[actionId],
          color,
          action: actionId,
        })),
      ];
    }, []);

    for (let i = 0; i < 4; i++) {
      deck.push({ name: "draw four", color: "any", action: 13 });
      deck.push({ name: "wild", color: "any", action: 14 });
    }

    return queryInterface.bulkInsert("deck", deck);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('deck', null, {});
  }
};
