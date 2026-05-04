"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("events", "registration_start", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "registration_end", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "description_divisi", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("events", "registration_start");
    await queryInterface.removeColumn("events", "registration_end");
    await queryInterface.removeColumn("events", "description_divisi");
  },
};