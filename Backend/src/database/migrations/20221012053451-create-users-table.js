"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
          },
          username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          study_program: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          major: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          nim: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          batch_year: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          file_path: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          role: {
            type: Sequelize.TINYINT,
            allowNull: true,
            defaultValue: 0,
          },
          reset_token: {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: null,
          },
          reset_token_expiry: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
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
      await queryInterface.dropTable("users", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
