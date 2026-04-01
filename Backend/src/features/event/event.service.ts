import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { S3Helper } from "src/cores/helpers/s3.helper";
import { User } from "../user/entities/user.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.eventModel,
        query,
      )
        .where(condition)
        .options({
          include: [{ model: User, attributes: ["id", "name", "email"] }],
        })
        .getResult();

      const result = {
        count: count,
        events: data,
      };
      return this.response.success(result, 200, "Successfully get events");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(event: Event) {
    return this.response.success(event, 200, "Successfully get event");
  }

  async create(createEventDto: CreateEventDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const event = await this.eventModel.create(
        { ...createEventDto },
        { transaction },
      );
      await transaction.commit();
      return this.response.success({ event }, 201, "Successfully created event");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(event: Event, updateEventDto: UpdateEventDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await event.update(updateEventDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { event },
        200,
        "Successfully updated event",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async uploadImage(event: Event, file: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (event.image_file) {
        await s3Helper.deleteFile(event.image_file);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          "events/images",
          "public-read",
        );

        const imageUrl = new URL(uploadResult.Location);

        await event.update(
          {
            image_file: imageUrl.pathname.substring(1),
            image_url: imageUrl.href,
          },
          { transaction },
        );
      } else {
        await event.update(
          {
            image_file: null,
            image_url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        event,
        200,
        "Successfully update event image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(event: Event) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (event.image_file) {
        await s3Helper.deleteFile(event.image_file);
      }

      await event.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully deleted event");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
