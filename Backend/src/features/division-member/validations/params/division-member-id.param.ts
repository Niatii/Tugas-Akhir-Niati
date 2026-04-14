import * as Joi from "joi";
import { DivisionMember } from "../../entities/division-member.entity";

export const divisionMemberIdExternal = async (value) => {
  const divisionMember = await DivisionMember.findOne({
    where: { id: value.id, division_id: value.divisionId },
  });
  if (!divisionMember) {
    throw new Joi.ValidationError(
      "any.invalid-division-member-id",
      [
        {
          message: "Division member not found",
          path: ["id"],
          type: "any.invalid-division-member-id",
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
  return divisionMember;
};

export const divisionMemberIdParamSchema = Joi.object()
  .required()
  .external(divisionMemberIdExternal);
