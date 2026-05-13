import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';

import { Division } from '../division/entities/division.entity';
import { Event } from '../event/entities/event.entity';

import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

import { Meeting } from './entities/meeting.entity';
import { MeetingTypeEnum } from './enums/meeting-type.enum';
import { Attendance } from '../attendace/entities/attendace.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(Meeting)
    private readonly meetingModel: typeof Meeting,

    private readonly response: ResponseHelper,

    private readonly sequelize: Sequelize,
  ) {}

  async getOwnedEventIds(user: any) {
    const events = await Event.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ['id'],
    });

    return events.map((event) => event.id);
  }

  async validateEventOwnership(eventId: number, user: any) {
    const event = await Event.findOne({
      where: {
        id: eventId,
        user_id: user.id,
      },
    });

    return !!event;
  }

  async getAccessibleEventIds(user: any) {
    const eventIds = await this.getOwnedEventIds(user);

    if (user?.division_id) {
      const division = await Division.findByPk(user.division_id, {
        attributes: ['event_id'],
      });
      if (division?.event_id && !eventIds.includes(division.event_id)) {
        eventIds.push(division.event_id);
      }
    }

    return eventIds;
  }

  async canViewMeeting(meeting: Meeting, user: any) {
    const isOwner = await this.validateEventOwnership(meeting.event_id, user);
    if (isOwner) {
      return true;
    }

    if (!user?.division_id) {
      return false;
    }

    const division = await Division.findByPk(user.division_id, {
      attributes: ['event_id'],
    });

    if (!division || division.event_id !== meeting.event_id) {
      return false;
    }

    if (meeting.meeting_type === MeetingTypeEnum.GENERAL) {
      return true;
    }

    return meeting.division_id === user.division_id;
  }

  async findAll(query: any, user: any) {
    try {
      const eventIds = await this.getAccessibleEventIds(user);

      if (!eventIds.length) {
        return this.response.success(
          {
            count: 0,
            meetings: [],
          },
          200,
          'Successfully get meetings',
        );
      }

      const condition: any = {};

      if (user.role === 0) {
        condition.event_id = {
          [Op.in]: eventIds,
        };
      } else {
        const orConditions: any[] = [
          {
            event_id: eventIds,
            meeting_type: MeetingTypeEnum.GENERAL,
          },
        ];

        if (user?.division_id) {
          orConditions.push({
            division_id: user.division_id,
            meeting_type: MeetingTypeEnum.DIVISION,
          });
        }

        condition[Op.or] = orConditions;
      }

      const resultQuery = await new QueryBuilderHelper(this.meetingModel, query)
        .where(condition)
        .options({
          include: [
            {
              model: Event,
              attributes: ['id', 'title'],
            },
            {
              model: Division,
              attributes: ['id', 'name'],
            },
          ],
        })
        .getResult();

      if (!resultQuery) {
        return this.response.fail('Failed to get meetings', 400);
      }

      const { count, data } = resultQuery;

      return this.response.success(
        {
          count,
          meetings: data,
        },
        200,
        'Successfully get meetings',
      );
    } catch (error) {
      console.log(error);

      return this.response.fail(error?.message || error, 400);
    }
  }

  async findOne(meeting: Meeting, user: any) {
    try {
      const fullMeeting = await this.meetingModel.findByPk(meeting.id, {
        include: [
          {
            model: Event,
            attributes: ['id', 'title', 'user_id'],
            include: [
              {
                association: 'user',
                attributes: ['id', 'name', 'email'],
              },
            ],
          },
          {
            model: Division,
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!fullMeeting) {
        return this.response.fail('Meeting not found', 404);
      }

      const canView = await this.canViewMeeting(fullMeeting, user);
      if (!canView) {
        return this.response.fail('You cannot access this meeting', 403);
      }

      return this.response.success(
        fullMeeting,
        200,
        'Successfully get meeting',
      );
    } catch (error) {
      console.log(error);

      return this.response.fail(error?.message || error, 400);
    }
  }

  async create(createMeetingDto: CreateMeetingDto, user: any) {
    const transaction = await this.sequelize.transaction();

    try {
      /**
       * ===================================
       * VALIDASI EVENT
       * ===================================
       */
      const isOwner = await this.validateEventOwnership(
        createMeetingDto.event_id,
        user,
      );

      if (!isOwner) {
        return this.response.fail(
          'You cannot create meeting for this event',
          403,
        );
      }

      /**
       * ===================================
       * ROLE ORGANISASI
       * Hanya bisa buat rapat umum
       * ===================================
       */
      if (user.role === 0) {
        createMeetingDto.division_id = null;

        createMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (user.role === 1) {
        /**
         * ===================================
         * ROLE COORDINATOR
         * Hanya bisa buat rapat divisi
         * ===================================
         */
        createMeetingDto.division_id = user.division_id;

        createMeetingDto.meeting_type = MeetingTypeEnum.DIVISION;
      }

      /**
       * ===================================
       * CREATE MEETING
       * ===================================
       */
      const meeting = await this.meetingModel.create(
        {
          ...createMeetingDto,
        },
        { transaction },
      );

      /**
       * ===================================
       * GENERAL MEETING
       * Semua anggota event
       * ===================================
       */
      if (meeting.meeting_type === MeetingTypeEnum.GENERAL) {
        const divisions = await Division.findAll({
          where: {
            event_id: meeting.event_id,
          },

          include: [
            {
              association: 'members',
            },
          ],
        });

        /**
         * Gabungkan semua member division
         */
        const allMembers = [];

        for (const division of divisions) {
          if (division.members?.length) {
            allMembers.push(...division.members);
          }
        }

        /**
         * Remove duplicate user
         */
        const uniqueMembers = allMembers.filter(
          (member: any, index: number, self: any[]) =>
            index === self.findIndex((m: any) => m.user_id === member.user_id),
        );

        if (uniqueMembers.length) {
          const attendances = uniqueMembers.map((member: any) => ({
            meeting_id: meeting.id,

            user_id: member.user_id,

            /**
             * 0 = Tidak Hadir
             */
            status: 0,
          }));

          await this.attendanceModel.bulkCreate(attendances, {
            transaction,
          });
        }
      }

      /**
       * ===================================
       * DIVISION MEETING
       * Hanya anggota divisi
       * ===================================
       */
      if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
        const division = await Division.findByPk(meeting.division_id, {
          include: [
            {
              association: 'members',
            },
          ],
        });

        if (division?.members?.length) {
          const attendances = division.members.map((member: any) => ({
            meeting_id: meeting.id,

            user_id: member.user_id,

            /**
             * 0 = Tidak Hadir
             */
            status: 0,
          }));

          await this.attendanceModel.bulkCreate(attendances, {
            transaction,
          });
        }
      }

      /**
       * ===================================
       * COMMIT
       * ===================================
       */
      await transaction.commit();

      return this.response.success(
        { meeting },
        201,
        'Successfully created meeting',
      );
    } catch (error) {
      await transaction.rollback();

      console.log(error);

      return this.response.fail(error?.message || error, 400);
    }
  }
  async update(
    meeting: Meeting,
    updateMeetingDto: UpdateMeetingDto,
    user: any,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const isOwner = await this.validateEventOwnership(meeting.event_id, user);

      if (!isOwner) {
        return this.response.fail('You cannot update this meeting', 403);
      }

      if (user.role === 0) {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail('Admin cannot edit division meeting', 403);
        }

        updateMeetingDto.division_id = null;

        updateMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (user.role === 1) {
        if (meeting.meeting_type !== MeetingTypeEnum.DIVISION) {
          return this.response.fail(
            'Coordinator cannot edit general meeting',
            403,
          );
        }

        if (meeting.division_id !== user.division_id) {
          return this.response.fail(
            'Coordinator can only edit own division meeting',
            403,
          );
        }

        updateMeetingDto.division_id = user.division_id;

        updateMeetingDto.meeting_type = MeetingTypeEnum.DIVISION;
      }

      await meeting.update(updateMeetingDto, {
        transaction,
      });

      await transaction.commit();

      return this.response.success(
        { meeting },
        200,
        'Successfully updated meeting',
      );
    } catch (error) {
      await transaction.rollback();

      return this.response.fail(error?.message || error, 400);
    }
  }

  async remove(meeting: Meeting, user: any) {
    const transaction = await this.sequelize.transaction();

    try {
      const isOwner = await this.validateEventOwnership(meeting.event_id, user);

      if (!isOwner) {
        return this.response.fail('You cannot delete this meeting', 403);
      }
      if (meeting.status !== 0) {
        return this.response.fail(
          'Meeting that is already in progress or completed cannot be deleted',
          403,
        );
      }
      if (user.role === 0) {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail(
            'Admin cannot delete division meeting',
            403,
          );
        }
      } else if (user.role === 1) {
        if (meeting.meeting_type !== MeetingTypeEnum.DIVISION) {
          return this.response.fail(
            'Coordinator cannot delete general meeting',
            403,
          );
        }

        if (meeting.division_id !== user.division_id) {
          return this.response.fail(
            'Coordinator can only delete own division meeting',
            403,
          );
        }
      }

      await meeting.destroy({
        transaction,
      });

      await transaction.commit();

      return this.response.success({}, 200, 'Successfully deleted meeting');
    } catch (error) {
      await transaction.rollback();

      return this.response.fail(error?.message || error, 400);
    }
  }

  async startMeeting(meetingId: number, user: any) {
    const meeting = await this.meetingModel.findByPk(meetingId);

    if (!meeting) {
      return this.response.fail('Meeting not found', 404);
    }

    /**
     * hanya meeting scheduled
     * yang bisa dimulai
     */
    if (meeting.status !== 0) {
      return this.response.fail('Meeting already started', 400);
    }

    await meeting.update({
      status: 1,
      started_at: new Date(),
    });

    return this.response.success(meeting, 200, 'Meeting started successfully');
  }

  async finishMeeting(meetingId: number, user: any) {
    const meeting = await this.meetingModel.findByPk(meetingId);

    if (!meeting) {
      return this.response.fail('Meeting not found', 404);
    }

    /**
     * hanya meeting ongoing
     * yang bisa diselesaikan
     */
    if (meeting.status !== 1) {
      return this.response.fail('Meeting is not running', 400);
    }

    await meeting.update({
      status: 2,
      ended_at: new Date(),
    });

    return this.response.success(
      meeting,
      200,
      'Meeting completed successfully',
    );
  }
}
