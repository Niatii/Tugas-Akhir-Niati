import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import * as crypto from "crypto";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { MailService } from "src/cores/helpers/mail.service";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateUserDto } from "src/features/auth/dto/create-user.dto";
import { ForgotPasswordDto } from "src/features/auth/dto/forgot-password.dto";
import { ResetPasswordDto } from "src/features/auth/dto/reset-password.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectModel(User) private userModel: typeof User
  ) {}

  login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const result = {
      user,
      access_token: this.jwtService.sign(payload),
    };
    return this.response.success(result, 200);
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        where: { [Op.or]: { email: username, username: username } },
        attributes: { include: ["password"] },
      });

      if (user) {
        const isValid = await Bun.password.verify(
          password,
          user.password.replace(/\$2y\$|\$2a\$/, "$2b$")
        );

        if (isValid) {
          const result = user.toJSON();
          delete result.password;
          return result;
        }
      }

      return false;
    } catch (error) {
      console.log(error);
      return this.response.fail(error, HttpStatus.BAD_REQUEST);
    }
  }

  async validateJwt(id: number) {
    const user = await this.userModel.findByPk(id);
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      createUserDto.password = await Bun.password.hash(createUserDto.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const user = await this.userModel
        .create({ ...createUserDto })
        .then((value) => value.toJSON());

      delete user.password;
      await transaction.commit();
      return this.response.success(
        user,
        HttpStatus.OK,
        "Successfully register user"
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
      "Successfully get profile"
    );
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.userModel.findOne({
        where: { email: dto.email },
        attributes: { include: ["reset_token", "reset_token_expiry"] },
      });

      if (!user) {
        return this.response.success(
          null,
          HttpStatus.OK,
          "Jika email terdaftar, link reset akan dikirim"
        );
      }

      const token = crypto.randomBytes(32).toString("hex");

      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);

      await user.update({
        reset_token: token,
        reset_token_expiry: expiry,
      });

      await this.mailService.sendResetPasswordEmail(
        user.email,
        user.name,
        token
      );

      return this.response.success(
        null,
        HttpStatus.OK,
        "Link reset kata sandi telah dikirim ke email kamu"
      );
    } catch (error) {
      console.error('[ForgotPassword Error]', error?.message || error);
      return this.response.fail(
        `Gagal mengirim email reset: ${error?.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.userModel.findOne({
        where: { reset_token: dto.token },
        attributes: { include: ["reset_token", "reset_token_expiry", "password"] },
      });

      if (!user) {
        return this.response.fail(
          "Token tidak valid atau sudah digunakan",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!user.reset_token_expiry || new Date() > user.reset_token_expiry) {
        return this.response.fail(
          "Token sudah kadaluarsa. Silakan request reset password baru.",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword = await Bun.password.hash(dto.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      await user.update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      });

      return this.response.success(
        null,
        HttpStatus.OK,
        "Kata sandi berhasil diperbarui. Silakan login dengan kata sandi baru."
      );
    } catch (error) {
      console.error(error);
      return this.response.fail(
        "Gagal mereset kata sandi. Coba lagi nanti.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
