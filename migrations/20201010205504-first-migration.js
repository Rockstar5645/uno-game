'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'test_table',
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
        testString: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    );
    queryInterface.createTable(
      'Cards',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
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

    return 1;

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('test_table');
  }
};