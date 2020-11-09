'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('deck',
      [
        // 4 zeroes
        {
          name: 'zero',
          color: 'red',
          count: 1,
        },
        {
          name: 'zero',
          color: 'yellow',
          count: 1,
        },
        {
          name: 'zero',
          color: 'green',
          count: 1,
        },
        {
          name: 'zero',
          color: 'blue',
          count: 1,
        },

        // ones
        {
          name: 'one',
          color: 'red',
          count: 2,
        },
        {
          name: 'one',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'one',
          color: 'green',
          count: 2,
        },
        {
          name: 'one',
          color: 'blue',
          count: 2,
        },
        // twos
        {
          name: 'two',
          color: 'red',
          count: 2,
        },
        {
          name: 'two',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'two',
          color: 'green',
          count: 2,
        },
        {
          name: 'two',
          color: 'blue',
          count: 2,
        },
        // threes
        {
          name: 'three',
          color: 'red',
          count: 2,
        },
        {
          name: 'three',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'three',
          color: 'green',
          count: 2,
        },
        {
          name: 'three',
          color: 'blue',
          count: 2,
        },
        // fours
        {
          name: 'four',
          color: 'red',
          count: 2,
        },
        {
          name: 'four',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'four',
          color: 'green',
          count: 2,
        },
        {
          name: 'four',
          color: 'blue',
          count: 2,
        },
        // fives
        {
          name: 'five',
          color: 'red',
          count: 2,
        },
        {
          name: 'five',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'five',
          color: 'green',
          count: 2,
        },
        {
          name: 'five',
          color: 'blue',
          count: 2,
        },
        // sixes
        {
          name: 'six',
          color: 'red',
          count: 2,
        },
        {
          name: 'six',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'six',
          color: 'green',
          count: 2,
        },
        {
          name: 'six',
          color: 'blue',
          count: 2,
        },
        // sevens
        {
          name: 'seven',
          color: 'red',
          count: 2,
        },
        {
          name: 'seven',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'seven',
          color: 'green',
          count: 2,
        },
        {
          name: 'seven',
          color: 'blue',
          count: 2,
        },
        // eights
        {
          name: 'eight',
          color: 'red',
          count: 2,
        },
        {
          name: 'eight',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'eight',
          color: 'green',
          count: 2,
        },
        {
          name: 'eight',
          color: 'blue',
          count: 2,
        },
        // nines
        {
          name: 'nine',
          color: 'red',
          count: 2,
        },
        {
          name: 'nine',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'nine',
          color: 'green',
          count: 2,
        },
        {
          name: 'nine',
          color: 'blue',
          count: 2,
        },
        // skips
        {
          name: 'skip',
          color: 'red',
          count: 2,
        },
        {
          name: 'skip',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'skip',
          color: 'green',
          count: 2,
        },
        {
          name: 'skip',
          color: 'blue',
          count: 2,
        },
        // reverses
        {
          name: 'reverse',
          color: 'red',
          count: 2,
        },
        {
          name: 'reverse',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'reverse',
          color: 'green',
          count: 2,
        },
        {
          name: 'reverse',
          color: 'blue',
          count: 2,
        },
        // draw twos
        {
          name: 'draw2',
          color: 'red',
          count: 2,
        },
        {
          name: 'draw2',
          color: 'yellow',
          count: 2,
        },
        {
          name: 'draw2',
          color: 'green',
          count: 2,
        },
        {
          name: 'draw2',
          color: 'blue',
          count: 2,
        },
        // draw fours (wild is implied)
        {
          name: 'draw4',
          color: 'any',
          count: 4,
        },
        // wilds
        {
          name: 'wild',
          color: 'any',
          count: 4,
        },
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('deck', null, {});
  }
};
