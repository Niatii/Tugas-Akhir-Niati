import * as Joi from "joi";
import { Division } from "../../entities/division.entity";

export const divisionIdExternal = async (value) => {
  const division = await Division.findOne({
    where: { id: value },
  });
  if (!division) {
    throw new Joi.ValidationError(
      "any.invalid-division-id",
      [
        {
          message: "division not found",
          path: ["id"],
          type: "any.invalid-division-id",
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
  return division;
};

export const divisionIdParamSchema = Joi.number()
  .required()
  .external(divisionIdExternal);
