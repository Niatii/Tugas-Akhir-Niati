import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import { getEventStatusEnums } from "../../enums/event-status.enum";

const eventStatusEnum = getEventStatusEnums().map((value) => +value.id);

export const updateEventSchema = Joi.object({
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
  title: Joi.string().required(),
  description: Joi.string().optional(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
  status: Joi.number()
    .integer()
    .optional()
    .valid(...eventStatusEnum),
  benefit: Joi.string().optional(),
  requirement: Joi.string().optional(),
});
