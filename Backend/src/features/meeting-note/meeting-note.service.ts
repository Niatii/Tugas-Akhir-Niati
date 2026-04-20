import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Meeting } from "../meeting/entities/meeting.entity";
import { CreateMeetingNoteDto } from "./dto/create-meeting-note.dto";
import { UpdateMeetingNoteDto } from "./dto/update-meeting-note.dto";
import { MeetingNote } from "./entities/meeting-note.entity";

@Injectable()
export class MeetingNoteService {
  constructor(
    @InjectModel(MeetingNote)
    private readonly meetingNoteModel: typeof MeetingNote,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.meetingNoteModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: Meeting, attributes: ["id", "title"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        notes: data,
      };
      return this.response.success(result, 200, "Successfully get meeting notes");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(meetingNote: MeetingNote) {
    return this.response.success(meetingNote, 200, "Successfully get meeting note");
  }

  async create(createMeetingNoteDto: CreateMeetingNoteDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const meetingNote = await this.meetingNoteModel.create(
        { ...createMeetingNoteDto } as any,
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { meetingNote },
        201,
        "Successfully created meeting note",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(meetingNote: MeetingNote, updateMeetingNoteDto: UpdateMeetingNoteDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await meetingNote.update(updateMeetingNoteDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { meetingNote },
        200,
        "Successfully updated meeting note",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(meetingNote: MeetingNote) {
    const transaction = await this.sequelize.transaction();
    try {
      await meetingNote.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully deleted meeting note");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
