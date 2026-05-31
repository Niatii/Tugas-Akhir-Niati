"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "certificate_template_fields",
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          template_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "certificate_templates",
              key: "id",
            },
            onDelete: "CASCADE",
          },
          // field_type: nama_peserta, nama_acara, tanggal_acara, jabatan, divisi,
          //             nomor_sertifikat, qr_code, ttd_digital, nama_organisasi,
          //             tahun, predikat, custom_text
          field_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          // Custom label for custom_text type
          label: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          pos_x: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          pos_y: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          width: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          height: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          font_size: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 16,
          },
          font_family: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "Arial",
          },
          color: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "#000000",
          },
          rotation: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0,
          },
          alignment: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "left",
          },
          z_index: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
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
      await queryInterface.dropTable("certificate_template_fields", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
