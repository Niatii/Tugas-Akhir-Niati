"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const table = await queryInterface.describeTable('certificates');

      // Add columns only if they don't exist
      if (!table.certificate_number) {
        await queryInterface.addColumn(
          "certificates",
          "certificate_number",
          {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          { transaction },
        );
      }

      if (!table.attendance_percentage) {
        await queryInterface.addColumn(
          "certificates",
          "attendance_percentage",
          {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: null,
          },
          { transaction },
        );
      }

      if (!table.status) {
        await queryInterface.addColumn(
          "certificates",
          "status",
          {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 0,
          },
          { transaction },
        );
      }

      if (!table.is_manual) {
        await queryInterface.addColumn(
          "certificates",
          "is_manual",
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction },
        );
      }

      if (!table.published_at) {
        await queryInterface.addColumn(
          "certificates",
          "published_at",
          {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
          },
          { transaction },
        );
      }

      if (!table.template_id) {
        await queryInterface.addColumn(
          "certificates",
          "template_id",
          {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null,
          },
          { transaction },
        );
        // We intentionally avoid creating a foreign key constraint here to
        // prevent issues when database/table engines or existing constraints
        // make FK creation fail during ALTER TABLE.
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const table = await queryInterface.describeTable('certificates');

      if (table.certificate_number) {
        await queryInterface.removeColumn(
          "certificates",
          "certificate_number",
          { transaction },
        );
      }

      if (table.attendance_percentage) {
        await queryInterface.removeColumn(
          "certificates",
          "attendance_percentage",
          { transaction },
        );
      }

      if (table.status) {
        await queryInterface.removeColumn(
          "certificates",
          "status",
          { transaction },
        );
      }

      if (table.is_manual) {
        await queryInterface.removeColumn(
          "certificates",
          "is_manual",
          { transaction },
        );
      }

      if (table.published_at) {
        await queryInterface.removeColumn(
          "certificates",
          "published_at",
          { transaction },
        );
      }

      if (table.template_id) {
        await queryInterface.removeColumn(
          "certificates",
          "template_id",
          { transaction },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};