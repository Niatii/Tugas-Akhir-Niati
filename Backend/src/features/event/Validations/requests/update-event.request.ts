import * as Joi from 'joi';
import { User } from 'src/features/user/entities/user.entity';
import { getEventStatusEnums } from '../../enums/event-status.enum';

const eventStatusEnum = getEventStatusEnums().map((value) => +value.id);

export const updateEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
  benefit: Joi.string().required(),
  requirement: Joi.string().required(),
  registration_start: Joi.date().iso().required(),
  registration_end: Joi.date().iso().required(),
  description_divisi: Joi.string().required(),
  divisis: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().required(),
      }),
    )
    .optional(),
});
