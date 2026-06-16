"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "certificates",
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
          event_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "events",
              key: "id",
            },
          },
          file_path: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          file_url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          certificate_number: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          attendance_percentage: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: null,
          },
          status: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 0,
          },
          is_manual: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          published_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
          },
          template_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null,
          },
          issued_at: {
            type: Sequelize.DATE,
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
      await queryInterface.dropTable("certificates", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
