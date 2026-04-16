import * as Joi from "joi";
import { Certificate } from "../../entities/certificate.entity";

export const certificateIdExternal = async (value) => {
  const certificate = await Certificate.findOne({
    where: { id: value.id, event_id: value.eventId },
  });
  if (!certificate) {
    throw new Joi.ValidationError(
      "any.invalid-certificate-id",
      [
        {
          message: "Certificate not found",
          path: ["id"],
          type: "any.invalid-certificate-id",
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
  return certificate;
};

export const certificateIdParamSchema = Joi.object()
  .required()
  .external(certificateIdExternal);
