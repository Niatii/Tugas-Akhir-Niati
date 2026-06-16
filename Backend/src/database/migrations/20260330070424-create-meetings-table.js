"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "meetings",
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          event_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "events",
              key: "id",
            },
          },
          division_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "divisions",
              key: "id",
            },
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.TINYINT,
            allowNull: true,
            defaultValue: 0,
          },
          date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          updated_by: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          schedule_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          started_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          ended_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          location: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          meeting_type: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1,
          },
          created_at: {
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
      await queryInterface.dropTable("meetings", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
