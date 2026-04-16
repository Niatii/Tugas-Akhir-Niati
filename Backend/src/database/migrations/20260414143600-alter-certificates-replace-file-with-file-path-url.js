"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("certificates", "file", {
        transaction,
      });

      await queryInterface.addColumn(
        "certificates",
        "file_path",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        "certificates",
        "file_url",
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
      await queryInterface.removeColumn("certificates", "file_path", {
        transaction,
      });
      await queryInterface.removeColumn("certificates", "file_url", {
        transaction,
      });

      await queryInterface.addColumn(
        "certificates",
        "file",
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
