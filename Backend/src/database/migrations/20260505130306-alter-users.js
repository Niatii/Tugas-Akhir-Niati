"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const table = await queryInterface.describeTable("users");

      // =========================
      // 1. REMOVE COLUMN (SAFE)
      // =========================
      if (table.study_program) {
        await queryInterface.removeColumn("users", "study_program", { transaction });
      }

      if (table.major) {
        await queryInterface.removeColumn("users", "major", { transaction });
      }

      if (table.role) {
        await queryInterface.removeColumn("users", "role", { transaction });
      }

      // =========================
      // 2. ADD COLUMN (SAFE)
      // =========================
      if (!table.jurusan_id) {
        await queryInterface.addColumn(
          "users",
          "jurusan_id",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction }
        );
      }

      if (!table.prodi_id) {
        await queryInterface.addColumn(
          "users",
          "prodi_id",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction }
        );
      }

      // =========================
      // 3. FIX DATA
      // =========================
      await queryInterface.sequelize.query(
        `UPDATE users SET username = CONCAT('user_', id) WHERE username IS NULL;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE users SET nim = CONCAT('NIM_', id) WHERE nim IS NULL;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE users SET jurusan_id = 1 WHERE jurusan_id IS NULL;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE users SET prodi_id = 1 WHERE prodi_id IS NULL;`,
        { transaction }
      );

      // =========================
      // 4. SET NOT NULL
      // =========================
      await queryInterface.changeColumn(
        "users",
        "username",
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        "users",
        "nim",
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        "users",
        "jurusan_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        "users",
        "prodi_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
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
      const table = await queryInterface.describeTable("users");

      if (!table.study_program) {
        await queryInterface.addColumn("users", "study_program", {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction });
      }

      if (!table.major) {
        await queryInterface.addColumn("users", "major", {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction });
      }

      if (!table.role) {
        await queryInterface.addColumn("users", "role", {
          type: Sequelize.TINYINT,
          allowNull: true,
          defaultValue: 0,
        }, { transaction });
      }

      if (table.jurusan_id) {
        await queryInterface.removeColumn("users", "jurusan_id", { transaction });
      }

      if (table.prodi_id) {
        await queryInterface.removeColumn("users", "prodi_id", { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};