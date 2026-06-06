import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Meeting } from "../meeting/entities/meeting.entity";
import { EventRegistration } from "../event-registration/entities/event-registration.entity";
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

  async validateMeetingNoteManagePermission(
    meeting: Meeting,
    user: any,
  ) {
    /**
     * Admin organisasi
     * hanya manage rapat umum
     */
    if (user.role === 0) {
      return meeting.meeting_type === 1;
    }

    /**
     * Coordinator
     * cek registrasi event untuk dapatkan division_id
     */
    if (user.role === 1) {
      const registration = await EventRegistration.findOne({
        where: {
          event_id: meeting.event_id,
          user_id: user.id,
          status: 1,
        },
      });

      const isCoordinator =
        registration?.position?.toLowerCase() === 'koordinator';

      return (
        meeting.meeting_type === 2 &&
        isCoordinator &&
        meeting.division_id === registration?.division_id
      );
    }

    return false;
  }

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } =
        await new QueryBuilderHelper(
          this.meetingNoteModel,
          query,
        )
          .where(condition)
          .options({
            include: [
              {
                model: Meeting,
                attributes: ["id", "title"],
              },
            ],
          })
          .getResult();

      const result = {
        count: count,
        notes: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get meeting notes",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(meetingNote: MeetingNote) {
    return this.response.success(
      meetingNote,
      200,
      "Successfully get meeting note",
    );
  }

  async create(
    createMeetingNoteDto: CreateMeetingNoteDto,
    user: any,
  ) {
    const transaction =
      await this.sequelize.transaction();

    try {
      const meeting =
        await Meeting.findByPk(
          createMeetingNoteDto.meeting_id,
        );

      if (!meeting) {
        await transaction.rollback();

        return this.response.fail(
          "Meeting not found",
          404,
        );
      }

      /**
       * hanya meeting selesai
       */
      if (meeting.status !== 2) {
        await transaction.rollback();

        return this.response.fail(
          "Meeting note can only be filled after meeting completed",
          400,
        );
      }

      const canManage =
        await this.validateMeetingNoteManagePermission(
          meeting,
          user,
        );

      if (!canManage) {
        await transaction.rollback();

        return this.response.fail(
          "You cannot manage meeting note",
          403,
        );
      }

      /**
       * prevent duplicate note
       */
      const existingNote =
        await this.meetingNoteModel.findOne({
          where: {
            meeting_id:
              createMeetingNoteDto.meeting_id,
          },
        });

      if (existingNote) {
        await transaction.rollback();

        return this.response.fail(
          "Meeting note already exists",
          400,
        );
      }

      const meetingNote =
        await this.meetingNoteModel.create(
          {
            ...createMeetingNoteDto,
          } as any,
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

  async update(
    meetingNote: MeetingNote,
    updateMeetingNoteDto: UpdateMeetingNoteDto,
    user: any,
  ) {
    const transaction =
      await this.sequelize.transaction();

    try {
      const meeting =
        await Meeting.findByPk(
          meetingNote.meeting_id,
        );

      if (!meeting) {
        await transaction.rollback();

        return this.response.fail(
          "Meeting not found",
          404,
        );
      }

      /**
       * hanya meeting selesai
       */
      if (meeting.status !== 2) {
        await transaction.rollback();

        return this.response.fail(
          "Meeting note can only be updated after meeting completed",
          400,
        );
      }

      const canManage =
        await this.validateMeetingNoteManagePermission(
          meeting,
          user,
        );

      if (!canManage) {
        await transaction.rollback();

        return this.response.fail(
          "You cannot manage meeting note",
          403,
        );
      }

      await meetingNote.update(
        updateMeetingNoteDto,
        { transaction },
      );

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
    const transaction =
      await this.sequelize.transaction();

    try {
      await meetingNote.destroy({
        transaction,
      });

      await transaction.commit();

      return this.response.success(
        {},
        200,
        "Successfully deleted meeting note",
      );
    } catch (error) {
      await transaction.rollback();

      return this.response.fail(error, 400);
    }
  }
}