import * as Joi from 'joi'
import { getEventStatusEnums } from '../../enums/event-status.enum'

const eventStatusEnum = getEventStatusEnums().map((value) => +value.id)

export const createEventSchema = Joi.object({
  title: Joi.when('status', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null),
  }),

  description: Joi.when('status', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null),
  }),

  start_date: Joi.when('status', {
    is: 1,
    then: Joi.date().iso().required(),
    otherwise: Joi.date().iso().allow(null, ''),
  }),

  end_date: Joi.when('status', {
    is: 1,
    then: Joi.date().iso().required(),
    otherwise: Joi.date().iso().allow(null, ''),
  }),

  registration_start: Joi.when('status', {
    is: 1,
    then: Joi.date().iso().required(),
    otherwise: Joi.date().iso().allow(null, ''),
  }),

  registration_end: Joi.when('status', {
    is: 1,
    then: Joi.date().iso().required(),
    otherwise: Joi.date().iso().allow(null, ''),
  }),

  benefit: Joi.when('status', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null),
  }),

  requirement: Joi.when('status', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null),
  }),

  description_divisi: Joi.when('status', {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null),
  }),

  divisis: Joi.when('status', {
    is: 1,
    then: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
        }),
      )
      .min(1)
      .required(),

    otherwise: Joi.array().items(
      Joi.object({
        name: Joi.string().allow('', null),
      }),
    ),
  }),

  status: Joi.number()
    .integer()
    .optional()
    .valid(...eventStatusEnum)
    .default(0),
})