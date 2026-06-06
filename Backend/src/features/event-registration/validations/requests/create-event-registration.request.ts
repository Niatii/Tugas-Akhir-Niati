import * as Joi from "joi";
import { Division } from "src/features/division/entities/division.entity";
import { Event } from "src/features/event/entities/event.entity";
import { getEventRegistrationStatusEnums } from "../../enums/event-registration-status.enum";

const statusEnum = getEventRegistrationStatusEnums().map((value) => +value.id);

export const createEventRegistrationSchema = Joi.object({
  division_id: Joi.number()
    .required()
    .external(async (value) => {
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
    .required()
    .external(async (value) => {
      const event = await Event.findOne({ where: { id: value } });
      if (!event) {
        throw new Joi.ValidationError(
          "any.invalid-event-id",
          [{ message: "Event not found", path: ["event_id"], type: "any.invalid-event-id", context: { key: "event_id", label: "event_id", value } }],
          value,
        );
      }
    }),
  reason: Joi.string()
    .required()
    .messages({
      "any.required": "Alasan mengikuti acara wajib diisi",
      "string.empty": "Alasan mengikuti acara tidak boleh kosong",
    }),
  position: Joi.string().optional().allow("", null).default("Anggota"),
  status: Joi.number()
    .integer()
    .optional()
    .valid(...statusEnum)
    .default(0),
});
