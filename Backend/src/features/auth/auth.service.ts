import {
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { User } from '../user/entities/user.entity';
import { Jurusan } from '../jurusan/jurusan.model';
import { Prodi } from '../program-studi/prodi.model';
import { RegisterUserDto } from './dto/create-user.dto';
import { RegisterOrganizationDto } from './dto/create-admin.dto';
import { Organization } from '../organization/organization.model';

@Injectable()
export class AuthService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Jurusan) private jurusanModel: typeof Jurusan,
    @InjectModel(Prodi) private prodiModel: typeof Prodi,
    @InjectModel(Organization) private orgModel: typeof Organization,
  ) {}

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      type: user.type,
    };

    return this.response.success(
      {
        user,
        access_token: this.jwtService.sign(payload),
      },
      HttpStatus.OK,
      'Login berhasil',
    );
  }

  async validateUser(username: string, password: string) {
    try {
      let user: any = await this.userModel.findOne({
        where: { username },
        attributes: {
          include: ['password'],
        },
      });

      let type = 'user';

      if (!user) {
        user = await this.orgModel.findOne({
          where: { username },
          attributes: {
            include: ['password'],
          },
        });

        type = 'organization';
      }

      if (!user) {
        throw new UnauthorizedException('User tidak terdaftar');
      }

      const isValid = await Bun.password.verify(
        password,
        user.password.replace(/\$2y\$|\$2a\$/, '$2b$'),
      );

      if (!isValid) {
        throw new UnauthorizedException('Kata sandi salah');
      }

      const result = user.toJSON();

      delete result.password;

      return {
        ...result,
        type,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateJwt(id: number) {
    const user = await this.userModel.findByPk(id);
    return user;
  }

  async registerUser(dto: RegisterUserDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const usernameExist =
        (await this.userModel.findOne({ where: { username: dto.username } })) ||
        (await this.orgModel.findOne({ where: { username: dto.username } }));

      const emailExist = await this.userModel.findOne({
        where: { email: dto.email },
      });

      if (usernameExist) {
        throw new BadRequestException('Username sudah digunakan');
      }

      if (emailExist) {
        throw new BadRequestException('Email sudah digunakan');
      }

      const jurusan = await this.jurusanModel.findByPk(dto.jurusan_id);
      if (!jurusan) throw new BadRequestException('Jurusan tidak ditemukan');

      const prodi = await this.prodiModel.findByPk(dto.prodi_id);
      if (!prodi)
        throw new BadRequestException('Program studi tidak ditemukan');

      const hashed = await Bun.password.hash(dto.password, {
        algorithm: 'bcrypt',
        cost: 10,
      });

      const user = await this.userModel.create(
        {
          name: dto.name,
          nim: dto.nim,
          jurusan_id: dto.jurusan_id,
          prodi_id: dto.prodi_id,
          email: dto.email,
          username: dto.username,
          password: hashed,
        },
        { transaction },
      );

      await transaction.commit();

      const result = user.toJSON();
      delete result.password;

      return this.response.success(
        result,
        HttpStatus.CREATED,
        'Register panitia berhasil',
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return this.response.fail(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async registerOrganization(dto: RegisterOrganizationDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const usernameExist =
        (await this.userModel.findOne({ where: { username: dto.username } })) ||
        (await this.orgModel.findOne({ where: { username: dto.username } }));

      if (usernameExist) {
        throw new Error('Username sudah digunakan');
      }

      const emailExist = await this.orgModel.findOne({
        where: { email: dto.email },
      });

      if (emailExist) {
        throw new Error('Email sudah digunakan');
      }

      const hashed = await Bun.password.hash(dto.password, {
        algorithm: 'bcrypt',
        cost: 10,
      });

      const org = await this.orgModel.create(
        {
          name: dto.name,
          email: dto.email,
          username: dto.username,
          password: hashed,
        },
        { transaction },
      );

      await transaction.commit();

      const result = org.toJSON();
      delete result.password;

      return this.response.success(
        result,
        HttpStatus.CREATED,
        'Register organisasi berhasil',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  profile(user: User) {
    return this.response.success(
      user,
      HttpStatus.OK,
      'Successfully get profile',
    );
  }
}
