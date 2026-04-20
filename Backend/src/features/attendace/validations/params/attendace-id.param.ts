import * as Joi from "joi";
import { Attendance } from "../../entities/attendace.entity";

export const attendaceIdExternal = async (value) => {
  const attendance = await Attendance.findOne({
    where: { id: value },
  });
  if (!attendance) {
    throw new Joi.ValidationError(
      "any.invalid-attendace-id",
      [
        {
          message: "attendance not found",
          path: ["id"],
          type: "any.invalid-attendace-id",
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
  return attendance;
};

export const attendaceIdParamSchema = Joi.number()
  .required()
  .external(attendaceIdExternal);
