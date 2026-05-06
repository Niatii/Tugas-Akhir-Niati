import * as Joi from 'joi';
import { JoiException } from 'src/cores/helpers/joi-exception.helper';
import { User } from 'src/features/user/entities/user.entity';


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
          throw JoiException.handle('Username already exists', helper);
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
        throw JoiException.handle('Email already exists', helper);
      }
      return value;
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required(),

  nim: Joi.string().required(),

  jurusan_id: Joi.number().required(),

  prodi_id: Joi.number().required(),

  confirm_password: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Password tidak sama' }),
}).options({ abortEarly: false });
