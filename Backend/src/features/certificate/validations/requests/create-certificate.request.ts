import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import { Event } from "src/features/event/entities/event.entity";

export const createCertificateSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .external(async (value) => {
      const user = await User.findOne({
        where: { id: value },
      });
      if (!user) {
        throw new Joi.ValidationError(
          "any.invalid-user-id",
          [
            {
              message: "User not found",
              path: ["user_id"],
              type: "any.invalid-user-id",
              context: {
                key: "user_id",
                label: "user_id",
                value,
              },
            },
          ],
          value,
        );
      }
    }),
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
  file_path: Joi.string().optional(),
  file_url: Joi.string().optional(),
  issued_at: Joi.date().optional(),
});
