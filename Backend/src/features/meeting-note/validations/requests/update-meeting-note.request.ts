import * as Joi from "joi";
import { Meeting } from "src/features/meeting/entities/meeting.entity";
import { User } from "src/features/user/entities/user.entity";

export const updateMeetingNoteSchema = Joi.object({
  meeting_id: Joi.number()
    .optional()
    .external(async (value) => {
      if (value === undefined || value === null) return;
      const meeting = await Meeting.findOne({
        where: { id: value },
      });
      if (!meeting) {
        throw new Joi.ValidationError(
          "any.invalid-meeting-id",
          [
            {
              message: "Meeting not found",
              path: ["meeting_id"],
              type: "any.invalid-meeting-id",
              context: { key: "meeting_id", label: "meeting_id", value },
            },
          ],
          value,
        );
      }
    }),
  content: Joi.string().optional().allow("", null),
  created_by: Joi.number()
    .optional()
    .external(async (value) => {
      if (value === undefined || value === null) return;
      const user = await User.findOne({
        where: { id: value },
      });
      if (!user) {
        throw new Joi.ValidationError(
          "any.invalid-user-id",
          [
            {
              message: "User not found",
              path: ["created_by"],
              type: "any.invalid-user-id",
              context: { key: "created_by", label: "created_by", value },
            },
          ],
          value,
        );
      }
    }),
});
