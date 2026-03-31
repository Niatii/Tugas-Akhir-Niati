"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "events",
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          start_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          end_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          status: {
            type: Sequelize.TINYINT,
            allowNull: true,
            defaultValue: 0,
          },
          benefit: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          requirement: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
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
      await queryInterface.dropTable("events", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
