import * as Joi from "joi";
import { Event } from "src/features/event/entities/event.entity";

export const updateDivisionSchema = Joi.object({
  event_id: Joi.number()
    .required()
    .external(async (value) => {
      const event = await Event.findOne({
        where: { id: value },
      });
      if (!event) {
        throw new Joi.ValidationError(
          "any.invalid-event-id",
          [
            {
              message: "Event not found",
              path: ["event_id"],
              type: "any.invalid-event-id",
              context: {
                key: "event_id",
                label: "event_id",
                value,
              },
            },
          ],
          value,
        );
      }
    }),
  name: Joi.string().required(),
  description: Joi.string().optional(),
});
