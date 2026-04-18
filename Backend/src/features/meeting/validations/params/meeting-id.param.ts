import * as Joi from "joi";
import { Meeting } from "../../entities/meeting.entity";

export const meetingIdExternal = async (value) => {
  const meeting = await Meeting.findOne({
    where: { id: value },
  });
  if (!meeting) {
    throw new Joi.ValidationError(
      "any.invalid-meeting-id",
      [
        {
          message: "meeting not found",
          path: ["id"],
          type: "any.invalid-meeting-id",
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
  return meeting;
};

export const meetingIdParamSchema = Joi.number()
  .required()
  .external(meetingIdExternal);
