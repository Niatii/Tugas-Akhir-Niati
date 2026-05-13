'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ubah data lama string -> integer
    await queryInterface.sequelize.query(`
      UPDATE meetings
      SET meeting_type = 1
      WHERE meeting_type = 'umum'
    `);

    await queryInterface.sequelize.query(`
      UPDATE meetings
      SET meeting_type = 2
      WHERE meeting_type = 'divisi'
    `);

    // ubah column jadi integer
    await queryInterface.changeColumn('meetings', 'meeting_type', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    // balikin integer -> string
    await queryInterface.sequelize.query(`
      UPDATE meetings
      SET meeting_type = 'umum'
      WHERE meeting_type = 1
    `);

    await queryInterface.sequelize.query(`
      UPDATE meetings
      SET meeting_type = 'divisi'
      WHERE meeting_type = 2
    `);

    await queryInterface.changeColumn('meetings', 'meeting_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};