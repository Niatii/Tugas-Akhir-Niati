import * as Joi from 'joi'
import { Event } from 'src/features/event/entities/event.entity'
import { Division } from 'src/features/division/entities/division.entity'
import { getMeetingStatusEnums } from '../../enums/meeting-status.enum'
import { MeetingTypeEnum } from '../../enums/meeting-type.enum'

const meetingStatusEnum = getMeetingStatusEnums().map(
  (value) => +value.id,
)

export const updateMeetingSchema = Joi.object({
  event_id: Joi.number()
    .required()
    .external(async (value) => {
      const event = await Event.findOne({
        where: { id: value },
      })

      if (!event) {
        throw new Joi.ValidationError(
          'any.invalid-event-id',
          [
            {
              message: 'Event not found',
              path: ['event_id'],
              type: 'any.invalid-event-id',
              context: {
                key: 'event_id',
                label: 'event_id',
                value,
              },
            },
          ],
          value,
        )
      }
    }),

  division_id: Joi.number()
    .allow(null)
    .optional()
    .external(async (value) => {
      if (value === null || value === undefined) return

      const division = await Division.findOne({
        where: { id: value },
      })

      if (!division) {
        throw new Joi.ValidationError(
          'any.invalid-division-id',
          [
            {
              message: 'Division not found',
              path: ['division_id'],
              type: 'any.invalid-division-id',
              context: {
                key: 'division_id',
                label: 'division_id',
                value,
              },
            },
          ],
          value,
        )
      }
    }),

  title: Joi.string().required(),

  status: Joi.number()
    .integer()
    .optional()
    .valid(...meetingStatusEnum),

  date: Joi.date().iso().optional(),

  schedule_date: Joi.date().iso().required(),

  location: Joi.string().optional(),

  meeting_type: Joi.number()
    .valid(MeetingTypeEnum.GENERAL, MeetingTypeEnum.DIVISION)
    .optional(),
})