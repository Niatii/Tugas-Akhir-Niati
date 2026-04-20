import * as Joi from "joi";
import { MeetingNote } from "../../entities/meeting-note.entity";

export const meetingNoteIdExternal = async (value) => {
  const meetingNote = await MeetingNote.findOne({
    where: { id: value },
  });
  if (!meetingNote) {
    throw new Joi.ValidationError(
      "any.invalid-meeting-note-id",
      [
        {
          message: "meeting note not found",
          path: ["id"],
          type: "any.invalid-meeting-note-id",
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
  return meetingNote;
};

export const meetingNoteIdParamSchema = Joi.number()
  .required()
  .external(meetingNoteIdExternal);
