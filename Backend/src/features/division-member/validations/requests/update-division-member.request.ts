import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import { Division } from "src/features/division/entities/division.entity";

export const updateDivisionMemberSchema = Joi.object({
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
  division_id: Joi.number()
    .required()
    .external(async (value) => {
      const division = await Division.findOne({
        where: { id: value },
      });
      if (!division) {
        throw new Joi.ValidationError(
          "any.invalid-division-id",
          [
            {
              message: "Division not found",
              path: ["division_id"],
              type: "any.invalid-division-id",
              context: {
                key: "division_id",
                label: "division_id",
                value,
              },
            },
          ],
          value,
        );
      }
    }),
  position: Joi.string().optional(),
});
