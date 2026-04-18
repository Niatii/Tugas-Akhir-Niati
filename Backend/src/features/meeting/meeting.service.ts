import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Division } from "../division/entities/division.entity";
import { Event } from "../event/entities/event.entity";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { Meeting } from "./entities/meeting.entity";

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting)
    private readonly meetingModel: typeof Meeting,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.meetingModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: Event, attributes: ["id", "title"] },
            { model: Division, attributes: ["id", "name"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        meetings: data,
      };
      return this.response.success(result, 200, "Successfully get meetings");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(meeting: Meeting) {
    return this.response.success(meeting, 200, "Successfully get meeting");
  }

  async create(createMeetingDto: CreateMeetingDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const meeting = await this.meetingModel.create(
        { ...createMeetingDto },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { meeting },
        201,
        "Successfully created meeting",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(meeting: Meeting, updateMeetingDto: UpdateMeetingDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await meeting.update(updateMeetingDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { meeting },
        200,
        "Successfully updated meeting",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(meeting: Meeting) {
    const transaction = await this.sequelize.transaction();
    try {
      await meeting.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully deleted meeting");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
