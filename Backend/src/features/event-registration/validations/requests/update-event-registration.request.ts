import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import { Division } from "src/features/division/entities/division.entity";
import { Event } from "src/features/event/entities/event.entity";
import { getEventRegistrationStatusEnums } from "../../enums/event-registration-status.enum";

const statusEnum = getEventRegistrationStatusEnums().map((value) => +value.id);

export const updateEventRegistrationSchema = Joi.object({
  user_id: Joi.number()
    .optional()
    .external(async (value) => {
      if (value === undefined || value === null) return;
      const user = await User.findOne({ where: { id: value } });
      if (!user) {
        throw new Joi.ValidationError(
          "any.invalid-user-id",
          [{ message: "User not found", path: ["user_id"], type: "any.invalid-user-id", context: { key: "user_id", label: "user_id", value } }],
          value,
        );
      }
    }),
  division_id: Joi.number()
    .optional()
    .external(async (value) => {
      if (value === undefined || value === null) return;
      const division = await Division.findOne({ where: { id: value } });
      if (!division) {
        throw new Joi.ValidationError(
          "any.invalid-division-id",
          [{ message: "Division not found", path: ["division_id"], type: "any.invalid-division-id", context: { key: "division_id", label: "division_id", value } }],
          value,
        );
      }
    }),
  event_id: Joi.number()
    .optional()
    .external(async (value) => {
      if (value === undefined || value === null) return;
      const event = await Event.findOne({ where: { id: value } });
      if (!event) {
        throw new Joi.ValidationError(
          "any.invalid-event-id",
          [{ message: "Event not found", path: ["event_id"], type: "any.invalid-event-id", context: { key: "event_id", label: "event_id", value } }],
          value,
        );
      }
    }),
  reason: Joi.string().optional().allow("", null),
  status: Joi.number()
    .integer()
    .optional()
    .valid(...statusEnum),
  position: Joi.string()
    .optional()
    .valid('Anggota', 'Koordinator'),
});
