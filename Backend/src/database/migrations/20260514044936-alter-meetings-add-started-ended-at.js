'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'meetings',
      'started_at',
      {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'schedule_date',
      },
    )

    await queryInterface.addColumn(
      'meetings',
      'ended_at',
      {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'started_at',
      },
    )
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'meetings',
      'started_at',
    )

    await queryInterface.removeColumn(
      'meetings',
      'ended_at',
    )
  },
}