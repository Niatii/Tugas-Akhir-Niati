import * as Joi from "joi";
import { EventRegistration } from "../../entities/event-registration.entity";

export const eventRegistrationIdExternal = async (value) => {
  const eventRegistration = await EventRegistration.findOne({
    where: { id: value },
  });
  if (!eventRegistration) {
    throw new Joi.ValidationError(
      "any.invalid-event-registration-id",
      [
        {
          message: "Event registration not found",
          path: ["id"],
          type: "any.invalid-event-registration-id",
          context: {
            key: "id",
            label: "id",
            value,
          },
        },
      ],
      value,
    );
  }
  return eventRegistration;
};

export const eventRegistrationIdParamSchema = Joi.number()
  .required()
  .external(eventRegistrationIdExternal);
