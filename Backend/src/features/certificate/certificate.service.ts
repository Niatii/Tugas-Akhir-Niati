import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { S3Helper } from "src/cores/helpers/s3.helper";
import { Event } from "../event/entities/event.entity";
import { User } from "../user/entities/user.entity";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { Certificate } from "./entities/certificate.entity";

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate)
    private readonly certificateModel: typeof Certificate,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(event: Event, query: any) {
    try {
      const condition = { event_id: event.id };

      const { count, data } = await new QueryBuilderHelper(
        this.certificateModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            { model: Event, attributes: ["id", "name"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        certificates: data,
      };
      return this.response.success(
        result,
        200,
        "Successfully get certificates",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(certificate: Certificate) {
    return this.response.success(
      certificate,
      200,
      "Successfully get certificate",
    );
  }

  async create(event: Event, createCertificateDto: CreateCertificateDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const certificate = await this.certificateModel.create(
        {
          ...createCertificateDto,
          event_id: event.id,
        },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { certificate },
        201,
        "Successfully created certificate",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    certificate: Certificate,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await certificate.update(updateCertificateDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { certificate },
        200,
        "Successfully updated certificate",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async uploadFile(certificate: Certificate, file: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (certificate.file_path) {
        await s3Helper.deleteFile(certificate.file_path);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          "certificates/files",
          "public-read",
        );

        const fileUrl = new URL(uploadResult.Location);

        await certificate.update(
          {
            file_path: fileUrl.pathname.substring(1),
            file_url: fileUrl.href,
          },
          { transaction },
        );
      } else {
        await certificate.update(
          {
            file_path: null,
            file_url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        certificate,
        200,
        "Successfully update certificate file",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(certificate: Certificate) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (certificate.file_path) {
        await s3Helper.deleteFile(certificate.file_path);
      }

      await certificate.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        "Successfully deleted certificate",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
