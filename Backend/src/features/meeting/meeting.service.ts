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

@Injectable()
export class MeetingService {
  constructor(
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

  async findAll(query: any, user: any) {
    try {
      const eventIds = await this.getOwnedEventIds(user);

      const condition: any = {
        event_id: {
          [Op.in]: eventIds,
        },
      };

      if (user.type === 'coordinator') {
        condition.meeting_type = MeetingTypeEnum.DIVISION;

        condition.division_id = user.division_id;
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

      const isOwner = await this.validateEventOwnership(
        fullMeeting.event_id,
        user,
      );

      if (!isOwner) {
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

      if (user.type === 'admin') {
        createMeetingDto.division_id = null;

        createMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (user.type === 'coordinator') {
        createMeetingDto.division_id = user.division_id;

        createMeetingDto.meeting_type = MeetingTypeEnum.DIVISION;
      }

      const meeting = await this.meetingModel.create(
        {
          ...createMeetingDto,
        },
        { transaction },
      );

      await transaction.commit();

      return this.response.success(
        { meeting },
        201,
        'Successfully created meeting',
      );
    } catch (error) {
      await transaction.rollback();

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

      if (user.type === 'admin') {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail('Admin cannot edit division meeting', 403);
        }

        updateMeetingDto.division_id = null;

        updateMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (user.type === 'coordinator') {
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
      if (user.type === 'admin') {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail(
            'Admin cannot delete division meeting',
            403,
          );
        }
      } else if (user.type === 'coordinator') {
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
}
