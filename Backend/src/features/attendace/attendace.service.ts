import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Meeting } from "../meeting/entities/meeting.entity";
import { User } from "../user/entities/user.entity";
import { CreateAttendaceDto } from "./dto/create-attendace.dto";
import { UpdateAttendaceDto } from "./dto/update-attendace.dto";
import { Attendance } from "./entities/attendace.entity";

@Injectable()
export class AttendaceService {
  constructor(
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: Meeting, attributes: ["id", "title"] },
            { model: User, attributes: ["id", "name"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        attendances: data,
      };
      return this.response.success(result, 200, "Successfully get attendances");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(attendance: Attendance) {
    return this.response.success(attendance, 200, "Successfully get attendance");
  }

  async create(createAttendaceDto: CreateAttendaceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const attendance = await this.attendanceModel.create(
        { ...createAttendaceDto } as any,
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { attendance },
        201,
        "Successfully created attendance",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(attendance: Attendance, updateAttendaceDto: UpdateAttendaceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update(updateAttendaceDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { attendance },
        200,
        "Successfully updated attendance",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(attendance: Attendance) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully deleted attendance");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
