import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Division } from "../division/entities/division.entity";
import { Event } from "../event/entities/event.entity";
import { User } from "../user/entities/user.entity";
import { CreateEventRegistrationDto } from "./dto/create-event-registration.dto";
import { UpdateEventRegistrationDto } from "./dto/update-event-registration.dto";
import { EventRegistration } from "./entities/event-registration.entity";

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.eventRegistrationModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: User, attributes: ["id", "name"] },
            { model: Division, attributes: ["id", "name"] },
            { model: Event, attributes: ["id", "title"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        event_registrations: data,
      };
      return this.response.success(result, 200, "Successfully get event registrations");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(eventRegistration: EventRegistration) {
    return this.response.success(eventRegistration, 200, "Successfully get event registration");
  }

  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const eventRegistration = await this.eventRegistrationModel.create(
        { ...createEventRegistrationDto } as any,
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { event_registration: eventRegistration },
        201,
        "Successfully created event registration",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(eventRegistration: EventRegistration, updateEventRegistrationDto: UpdateEventRegistrationDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await eventRegistration.update(updateEventRegistrationDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { event_registration: eventRegistration },
        200,
        "Successfully updated event registration",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(eventRegistration: EventRegistration) {
    const transaction = await this.sequelize.transaction();
    try {
      await eventRegistration.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully deleted event registration");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
