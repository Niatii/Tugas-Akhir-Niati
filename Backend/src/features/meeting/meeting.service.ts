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
import EventStatusEnum from '../event/enums/event-status.enum';
import { Notification } from '../notification/entities/notification.entity';
import { MeetingNote } from '../meeting-note/entities/meeting-note.entity';
import { DivisionMember } from '../division-member/entities/division-member.entity';

import { EventRegistration } from '../event-registration/entities/event-registration.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(Meeting)
    private readonly meetingModel: typeof Meeting,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @InjectModel(MeetingNote)
    private readonly meetingNoteModel: typeof MeetingNote,
    @InjectModel(DivisionMember)
    private readonly divisionMemberModel: typeof DivisionMember,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  private normalizeDate(date: Date) {
    const normalized = new Date(date);

    normalized.setHours(0, 0, 0, 0);

    return normalized;
  }

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

    const registrations = await EventRegistration.findAll({
      where: {
        user_id: user.id,
        status: 1,
      },
      attributes: ['event_id'],
    });

    for (const reg of registrations) {
      if (!eventIds.includes(reg.event_id)) {
        eventIds.push(reg.event_id);
      }
    }

    return eventIds;
  }

  async canViewMeeting(meeting: Meeting, user: any) {
    const isOwner = await this.validateEventOwnership(meeting.event_id, user);
    if (isOwner) {
      return true;
    }

    const registration = await EventRegistration.findOne({
      where: {
        event_id: meeting.event_id,
        user_id: user.id,
        status: 1,
      },
    });

    if (!registration) {
      return false;
    }

    if (meeting.meeting_type === MeetingTypeEnum.GENERAL) {
      return true;
    }

    return meeting.division_id === registration.division_id;
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
          'Rapat berhasil ditampilkan',
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

        const registrations = await EventRegistration.findAll({
          where: {
            user_id: user.id,
            status: 1,
          },
          attributes: ['division_id'],
        });

        const divisionIds = registrations
          .map((reg) => reg.division_id)
          .filter((id) => id);

        if (divisionIds.length > 0) {
          orConditions.push({
            division_id: { [Op.in]: divisionIds },
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
        'Rapat berhasil ditampilkan',
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
        return this.response.fail('Kamu tidak memiliki akses ke rapat ini', 403);
      }

      return this.response.success(
        fullMeeting,
        200,
        'Rapat berhasil ditampilkan',
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
       * VALIDASI EVENT & ROLE
       * ===================================
       */
      const isOwner = await this.validateEventOwnership(
        createMeetingDto.event_id,
        user,
      );

      const registration = await EventRegistration.findOne({
        where: {
          event_id: createMeetingDto.event_id,
          user_id: user.id,
          status: 1,
        },
      });

      const isCoordinator =
        registration?.position?.toLowerCase() === 'koordinator';

      if (!isOwner && !isCoordinator) {
        return this.response.fail(
          'Kamu tidak memiliki akses untuk membuat rapat pada acara ini',
          403,
        );
      }

      const event = await Event.findByPk(createMeetingDto.event_id);

      if (!event) {
        return this.response.fail('Event not found', 404);
      }

      console.log({
        eventId: createMeetingDto.event_id,
        eventStatus: event.status,
        ongoingEnum: EventStatusEnum.ONGOING,
      });

      if (event.status !== EventStatusEnum.ONGOING) {
        return this.response.fail(
          'Rapat hanya bisa dibuat ketika acara sedang berlangsung',
          400,
        );
      }

      /**
       * ===================================
       * VALIDASI TANGGAL RAPAT
       * Tidak boleh sebelum tanggal event
       * ===================================
       */
      const meetingDate = createMeetingDto.schedule_date
        .toString()
        .split(' ')[0];

      const eventStartDate = event.start_date.toISOString().split('T')[0];
      console.log('VALIDASI TANGGAL KEPICU');
      if (meetingDate < eventStartDate) {
        return this.response.fail(
          'Tanggal rapat tidak boleh sebelum tanggal mulai event',
          400,
        );
      }

      /**
       * ===================================
       * ROLE ORGANISASI VS KOORDINATOR
       * ===================================
       */
      if (isOwner) {
        createMeetingDto.division_id = null;
        createMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (isCoordinator) {
        createMeetingDto.division_id = registration.division_id;
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

        if (uniqueMembers.length > 0) {
          const attendances = uniqueMembers.map((member: any) => ({
            meeting_id: meeting.id,
            user_id: member.user_id,
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

        const attendances = (division?.members || []).map((member: any) => ({
          meeting_id: meeting.id,
          user_id: member.user_id,
          status: 0,
        }));

        if (!attendances.some((a) => a.user_id === user.id)) {
          attendances.push({
            meeting_id: meeting.id,
            user_id: user.id,
            status: 0,
          });
        }

        if (attendances.length > 0) {
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

      // ─── Notif: rapat baru dijadwalkan hari ini ───
      try {
        const today = new Date();
        const scheduleDate = new Date(createMeetingDto.schedule_date);
        const isToday =
          scheduleDate.getFullYear() === today.getFullYear() &&
          scheduleDate.getMonth() === today.getMonth() &&
          scheduleDate.getDate() === today.getDate();

        if (isToday) {
          const event = await Event.findByPk(meeting.event_id, { attributes: ['id', 'title', 'user_id'] });
          const notifMessage = `Rapat "${meeting.title}" dijadwalkan hari ini. Jangan sampai ketinggalan!`;

          if (meeting.meeting_type === MeetingTypeEnum.GENERAL) {
            // Notif ke semua member aktif event
            const registrations = await EventRegistration.findAll({
              where: { event_id: meeting.event_id, status: 1 },
              attributes: ['user_id'],
            });
            const notifs = registrations.map((r) => ({
              type: 'meeting_today',
              notified_user_id: r.user_id,
              data: JSON.stringify({ meeting_id: meeting.id, event_id: meeting.event_id }),
              message: notifMessage,
            }));
            if (notifs.length) await this.notificationModel.bulkCreate(notifs);
          } else if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
            // Notif ke member divisi terkait
            const members = await this.divisionMemberModel.findAll({
              where: { division_id: meeting.division_id },
              attributes: ['user_id'],
            });
            const notifs = members.map((m) => ({
              type: 'meeting_today',
              notified_user_id: m.user_id,
              data: JSON.stringify({ meeting_id: meeting.id, event_id: meeting.event_id }),
              message: notifMessage,
            }));
            if (notifs.length) await this.notificationModel.bulkCreate(notifs);
          }
        }
      } catch (e) {
        console.error('[Notif] meeting_today error:', e?.message);
      }

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

      const registration = await EventRegistration.findOne({
        where: {
          event_id: meeting.event_id,
          user_id: user.id,
          status: 1,
        },
      });

      const isCoordinator =
        registration?.position?.toLowerCase() === 'koordinator';

      if (!isOwner && !isCoordinator) {
        return this.response.fail('You cannot update this meeting', 403);
      }

      const event = await Event.findByPk(meeting.event_id);

      if (!event) {
        return this.response.fail('Event not found', 404);
      }

      if (event.status !== EventStatusEnum.ONGOING) {
        return this.response.fail(
          'Rapat hanya bisa dibuat ketika acara sedang berlangsung',
          400,
        );
      }

      /**
       * ===================================
       * VALIDASI TANGGAL RAPAT
       * Tidak boleh sebelum tanggal event
       * ===================================
       */
      if (updateMeetingDto.schedule_date) {
        const meetingDate = this.normalizeDate(
          new Date(updateMeetingDto.schedule_date),
        );

        const eventStartDate = this.normalizeDate(new Date(event.start_date));

        if (meetingDate < eventStartDate) {
          return this.response.fail(
            'Tanggal rapat tidak boleh sebelum tanggal mulai event',
            400,
          );
        }
      }

      if (isOwner) {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail('Admin cannot edit division meeting', 403);
        }

        updateMeetingDto.division_id = null;
        updateMeetingDto.meeting_type = MeetingTypeEnum.GENERAL;
      } else if (isCoordinator) {
        if (meeting.meeting_type !== MeetingTypeEnum.DIVISION) {
          return this.response.fail(
            'Coordinator cannot edit general meeting',
            403,
          );
        }

        if (meeting.division_id !== registration.division_id) {
          return this.response.fail(
            'Coordinator can only edit own division meeting',
            403,
          );
        }

        updateMeetingDto.division_id = registration.division_id;
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

      const registration = await EventRegistration.findOne({
        where: {
          event_id: meeting.event_id,
          user_id: user.id,
          status: 1,
        },
      });

      const isCoordinator =
        registration?.position?.toLowerCase() === 'koordinator';

      if (!isOwner && !isCoordinator) {
        return this.response.fail('You cannot delete this meeting', 403);
      }

      const event = await Event.findByPk(meeting.event_id);

      if (!event) {
        return this.response.fail('Event not found', 404);
      }

      if (event.status !== EventStatusEnum.ONGOING) {
        return this.response.fail(
          'Rapat hanya bisa dibuat ketika acara sedang berlangsung',
          400,
        );
      }

      if (meeting.status !== 0) {
        return this.response.fail(
          'Rapat yang sedang berlangsung atau telah selesai tidak dapat dihapus',
          403,
        );
      }
      if (isOwner) {
        if (meeting.meeting_type !== MeetingTypeEnum.GENERAL) {
          return this.response.fail(
            'Admin cannot delete division meeting',
            403,
          );
        }
      } else if (isCoordinator) {
        if (meeting.meeting_type !== MeetingTypeEnum.DIVISION) {
          return this.response.fail(
            'Coordinator cannot delete general meeting',
            403,
          );
        }

        if (meeting.division_id !== registration.division_id) {
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

    const event = await Event.findByPk(meeting.event_id);

    if (!event) {
      return this.response.fail('Event not found', 404);
    }

    if (event.status !== EventStatusEnum.ONGOING) {
      return this.response.fail(
        'Rapat hanya bisa dibuat ketika acara sedang berlangsung',
        400,
      );
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

    const event = await Event.findByPk(meeting.event_id);

    if (!event) {
      return this.response.fail('Event not found', 404);
    }

    if (event.status !== EventStatusEnum.ONGOING) {
      return this.response.fail(
        'Rapat hanya bisa dibuat ketika acara sedang berlangsung',
        400,
      );
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

    // ─── Notif: rapat selesai tapi belum ada notulen ───
    try {
      const existingNote = await this.meetingNoteModel.findOne({
        where: { meeting_id: meeting.id },
      });

      if (!existingNote) {
        const event = await Event.findByPk(meeting.event_id, { attributes: ['id', 'title', 'user_id'] });
        const notifMessage = `Rapat "${meeting.title}" telah selesai. Jangan lupa submit notulen rapat!`;
        const notifData = JSON.stringify({ meeting_id: meeting.id, event_id: meeting.event_id });

        const notifTargets: number[] = [];

        if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
          // Notif ke koordinator divisi
          const coordinator = await this.divisionMemberModel.findOne({
            where: {
              division_id: meeting.division_id,
              position: { [Op.like]: '%koordinator%' },
            },
            attributes: ['user_id'],
          });
          if (coordinator) notifTargets.push(coordinator.user_id);
        }

        // Notif ke admin (pemilik event) — selalu
        if (event?.user_id && !notifTargets.includes(event.user_id)) {
          notifTargets.push(event.user_id);
        }

        if (notifTargets.length) {
          const notifs = notifTargets.map((uid) => ({
            type: 'meeting_no_notes',
            notified_user_id: uid,
            data: notifData,
            message: notifMessage,
          }));
          await this.notificationModel.bulkCreate(notifs);
        }
      }
    } catch (e) {
      console.error('[Notif] meeting_no_notes error:', e?.message);
    }

    return this.response.success(
      meeting,
      200,
      'Meeting completed successfully',
    );
  }
}
