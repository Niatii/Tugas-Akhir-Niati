import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { S3Helper } from 'src/cores/helpers/s3.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findPublicOrganization() {
    try {
      const organizations = await this.userModel.findAll({
        where: {
          role: 0,
        },

        attributes: ['id', 'name', 'email', 'phone_number', 'url'],
      });

      return this.response.success(
        organizations,
        200,
        'Successfully get organization profile',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }
  
  async findAll(query: any, user: User) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.userModel,
        query,
      )
        .where(condition)
        .getResult();

      const result = {
        count: count,
        users: data,
      };
      return this.response.success(result, 200, 'Successfully get users');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(user: User) {
    return this.response.success(user, 200, 'Successfully get user');
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const payload: any = { ...updateUserDto };

      // Validasi: Nama tidak boleh kosong
      if (!payload.name || !payload.name.trim()) {
        return this.response.fail('Nama tidak boleh kosong', 400);
      }

      // Validasi: Username tidak boleh kosong
      if (!payload.username || !payload.username.trim()) {
        return this.response.fail('Nama pengguna tidak boleh kosong', 400);
      }

      // Validasi: Email tidak boleh kosong
      if (!payload.email || !payload.email.trim()) {
        return this.response.fail('Email tidak boleh kosong', 400);
      }

      // Validasi: Format email harus valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return this.response.fail('Format email tidak valid', 400);
      }

      // Validasi: Email harus unik (tidak digunakan user lain)
      const existingEmail = await this.userModel.findOne({
        where: {
          email: payload.email,
          id: { [Op.ne]: user.id },
        },
      });
      if (existingEmail) {
        return this.response.fail('Email sudah digunakan oleh pengguna lain', 400);
      }

      // Validasi: Username harus unik (tidak digunakan user lain)
      const existingUsername = await this.userModel.findOne({
        where: {
          username: payload.username,
          id: { [Op.ne]: user.id },
        },
      });
      if (existingUsername) {
        return this.response.fail('Nama pengguna sudah digunakan oleh pengguna lain', 400);
      }

      if (user.role === 0) {
        // ADMIN (ORGANISASI): Proteksi field akademik agar tetap NULL
        delete payload.nim;
        delete payload.batch_year;
        delete payload.jurusan_id;
        delete payload.prodi_id;
      } else if (user.role === 1) {
        // COMMITTEE (PANITIA): Mahasiswa tidak boleh mengubah role mereka sendiri
        delete payload.role;
      }

      await user.update(payload, { transaction });
      await transaction.commit();
      return this.response.success({ user }, 200, 'Successfully updated user');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async updatePhotoProfile(user: User, file: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (user.file_path) {
        await s3Helper.deleteFile(user.file_path);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          'users/profile-photo',
          'public-read',
        );

        const imageUrl = new URL(uploadResult.Location);

        await user.update(
          { file_path: imageUrl.pathname.substring(1), url: imageUrl.href },
          { transaction },
        );
      } else {
        await user.update(
          {
            file_path: null,
            url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        user,
        200,
        'Successfully update photo profile',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await user.reload({ attributes: { include: ['password'] } });

      const isValid = await Bun.password.verify(
        changePasswordDto.old_password,
        user.password.replace(/\$2y\$|\$2a\$/, '$2b$'),
      );

      if (!isValid) {
        return this.response.fail('Invalid old password', 400);
      }

      changePasswordDto.new_password = await Bun.password.hash(
        changePasswordDto.new_password,
        {
          algorithm: 'bcrypt',
          cost: 10,
        },
      );

      await user.update(
        { password: changePasswordDto.new_password },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(user, 200, 'Successfully change password');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(user: User) {
    await user.destroy();
    return this.response.success({}, 200, 'Successfully delete user');
  }
}
