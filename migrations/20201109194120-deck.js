'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'deck',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        color: {
          type: Sequelize.STRING,
          allowNull: false
        },
        count: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deck');
  }
};
