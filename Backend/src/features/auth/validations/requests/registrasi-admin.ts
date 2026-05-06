import * as Joi from 'joi';
import { JoiException } from 'src/cores/helpers/joi-exception.helper';
import { User } from 'src/features/user/entities/user.entity';

export const registerOrgSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string().email().required(),

  username: Joi.string().required(),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required(),

  confirm_password: Joi.any()
    .valid(Joi.ref('password'))
    .required(),
});