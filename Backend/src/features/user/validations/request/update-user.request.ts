import * as Joi from "joi";
import { getUserRoleEnums } from "../../enums/user-role.enum";

const userRoleEnum = getUserRoleEnums().map((value) => +value.id);

export const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().optional().allow(null, ""),
  phone_number: Joi.string().optional().allow(null, ""),
  nim: Joi.string().optional().allow(null, ""),
  batch_year: Joi.string().optional().allow(null, ""),
  jurusan_id: Joi.number().optional().allow(null),
  prodi_id: Joi.number().optional().allow(null),
  role: Joi.number()
    .optional()
    .valid(...userRoleEnum),
}).options({ abortEarly: false });
