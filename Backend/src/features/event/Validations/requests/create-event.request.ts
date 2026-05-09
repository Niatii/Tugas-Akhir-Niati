import * as Joi from 'joi';
import { User } from 'src/features/user/entities/user.entity';
import { getEventStatusEnums } from '../../enums/event-status.enum';

const eventStatusEnum = getEventStatusEnums().map((value) => +value.id);

export const createEventSchema = Joi.object({
  // user_id: Joi.number()
  //   .required()
  //   .external(async (value) => {
  //     const user = await User.findOne({
  //       where: { id: value },
  //     });
  //     if (!user) {
  //       throw new Joi.ValidationError(
  //         'any.invalid-user-id',
  //         [
  //           {
  //             message: 'User not found',
  //             path: ['user_id'],
  //             type: 'any.invalid-user-id',
  //             context: {
  //               key: 'user_id',
  //               label: 'user_id',
  //               value,
  //             },
  //           },
  //         ],
  //         value,
  //       );
  //     }
  //   }),
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().required(),
  registration_start: Joi.date().iso().required(),
  registration_end: Joi.date().required(),
  status: Joi.number()
    .integer()
    .optional()
    .valid(...eventStatusEnum)
    .default(0),
  benefit: Joi.string().required(),
  requirement: Joi.string().required(),
  description_divisi: Joi.string().required(),
  divisis: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      }),
    )
    .min(1)
    .required(),
});
