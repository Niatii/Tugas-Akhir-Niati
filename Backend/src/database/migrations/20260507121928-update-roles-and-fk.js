'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const usersTable = await queryInterface.describeTable('users');
    if (!usersTable.role) {
      await queryInterface.addColumn('users', 'role', {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 1
      });
    } else {
      await queryInterface.sequelize.query(
        `UPDATE users SET role = 1 WHERE role IN (1, 2);`
      );
    }

    if (usersTable.nim) {
      await queryInterface.changeColumn('users', 'nim', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (usersTable.jurusan_id) {
      await queryInterface.changeColumn('users', 'jurusan_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (usersTable.prodi_id) {
      await queryInterface.changeColumn('users', 'prodi_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    const divisionMembersTable = await queryInterface.describeTable('division_members');
    if (!divisionMembersTable.role) {
      await queryInterface.addColumn('division_members', 'role', {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 2 // COMMITTEE
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'nim', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'jurusan_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'prodi_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.removeColumn('division_members', 'role');
    
    await queryInterface.removeColumn('users', 'role');
  }
};
