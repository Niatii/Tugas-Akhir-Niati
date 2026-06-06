import * as Joi from "joi";
import { JoiException } from "src/cores/helpers/joi-exception.helper";
import { User } from "src/features/user/entities/user.entity";
import UserRoleEnum from "src/features/user/enums/user-role.enum";
import { Jurusan } from "src/features/jurusan/jurusan.model";
import { Prodi } from "src/features/program-studi/prodi.model";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string()
    .required()
    .external(async (value, helper) => {
      if (value) {
        const user = await User.findOne({
          where: { username: value },
        });

        if (user) {
          throw JoiException.handle("Nama pengguna sudah digunakan oleh akun lain", helper);
        }
      }
      return value;
    }),
  email: Joi.string()
    .required()
    .external(async (value, helper) => {
      const user = await User.findOne({
        where: { email: value },
      });
      if (user) {
        throw JoiException.handle("Email sudah digunakan oleh akun lain", helper);
      }
      return value;
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.pattern.base": "Kata sandi harus terdiri dari kombinasi huruf dan angka",
      "string.min": "Kata sandi minimal harus 8 karakter",
    }),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
    "any.only": "Konfirmasi kata sandi tidak cocok"
  }),
  role: Joi.number()
    .valid(
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMMITTEE
    )
    .required(),
  nim: Joi.when('role', {
    is: UserRoleEnum.COMMITTEE,
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  jurusan_id: Joi.when('role', {
    is: UserRoleEnum.COMMITTEE,
    then: Joi.number().required().external(async (value, helper) => {
      if (value) {
        const jurusan = await Jurusan.findByPk(value);
        if (!jurusan) throw JoiException.handle("Jurusan not found", helper);
      }
      return value;
    }),
    otherwise: Joi.forbidden()
  }),
  prodi_id: Joi.when('role', {
    is: UserRoleEnum.COMMITTEE,
    then: Joi.number().required().external(async (value, helper) => {
      if (value) {
        const prodi = await Prodi.findByPk(value);
        if (!prodi) throw JoiException.handle("Prodi not found", helper);
      }
      return value;
    }),
    otherwise: Joi.forbidden()
  }),
}).options({ abortEarly: false });
