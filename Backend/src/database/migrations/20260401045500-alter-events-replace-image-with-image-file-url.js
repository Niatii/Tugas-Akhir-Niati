"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("events", "image", { transaction });

      await queryInterface.addColumn(
        "events",
        "image_file",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        "events",
        "image_url",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("events", "image_file", {
        transaction,
      });
      await queryInterface.removeColumn("events", "image_url", { transaction });

      await queryInterface.addColumn(
        "events",
        "image",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
