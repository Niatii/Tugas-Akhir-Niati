import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Meeting } from '../meeting/entities/meeting.entity';
import { User } from '../user/entities/user.entity';
import { Division } from '../division/entities/division.entity';
import { CreateAttendaceDto } from './dto/create-attendace.dto';
import { UpdateAttendaceDto } from './dto/update-attendace.dto';
import { Attendance } from './entities/attendace.entity';
import { Op } from 'sequelize';
import { Event } from '../event/entities/event.entity';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { MeetingTypeEnum } from '../meeting/enums/meeting-type.enum';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class AttendaceService {
  constructor(
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async validateEventOwnership(eventId: number, user: any) {
    const event = await Event.findOne({
      where: {
        id: eventId,
        user_id: user.id,
      },
    });

    return !!event;
  }

  async validateMeetingAccess(meeting: Meeting, user: any) {
    /**
     * Pastikan meeting milik event organisasi
     */
    const isOwner = await this.validateEventOwnership(meeting.event_id, user);

    if (!isOwner) {
      return {
        allowed: false,
        message: 'Kamu tidak memiliki akses ke rapat ini',
      };
    }

    /**
     * General meeting
     * semua anggota event bisa lihat
     */
    if (meeting.meeting_type === MeetingTypeEnum.GENERAL) {
      return {
        allowed: true,
      };
    }

    /**
     * Division meeting
     * hanya anggota division terkait
     */
    if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
      /**
       * organisasi/event owner
       * boleh view
       */
      if (user.role === 0) {
        return {
          allowed: true,
        };
      }

      /**
       * coordinator division terkait
       */
      if (user.role === 1 && meeting.division_id === user.division_id) {
        return {
          allowed: true,
        };
      }

      /**
       * anggota division terkait
       */
      if (user.division_id === meeting.division_id) {
        return {
          allowed: true,
        };
      }
    }

    return {
      allowed: false,
      message: 'Kamu tidak memiliki akses ke rapat ini',
    };
  }

  async validateAttendanceManagePermission(meeting: Meeting, user: any) {
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

    const isCoordinator =
      registration?.position?.toLowerCase() === 'koordinator';

    if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
      return isCoordinator && meeting.division_id === registration.division_id;
    }

    return false;
  }

  async validateAttendanceViewPermission(meeting: Meeting, user: any) {
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
      return false; // Not an approved member of this event
    }

    if (meeting.meeting_type === MeetingTypeEnum.DIVISION) {
      // Must be in the same division for a division meeting
      return meeting.division_id === registration.division_id;
    }

    // For general meetings, any approved member can view
    return true;
  }

  async findAll(query: any, user: any) {
    try {
      if (!query.meeting_id) {
        return this.response.fail('meeting_id is required', 400);
      }

      const meeting_id = Number(query.meeting_id);
      if (Number.isNaN(meeting_id)) {
        return this.response.fail('meeting_id must be a number', 400);
      }

      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      )
        .where({
          meeting_id,
        })
        .options({
          include: [
            {
              model: Meeting,
              attributes: [
                'id',
                'title',
                'meeting_type',
                'division_id',
                'event_id',
              ],
            },
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
        })
        .getResult();

      const meeting = await Meeting.findByPk(meeting_id);

      const canManage = meeting ? await this.validateAttendanceManagePermission(meeting, user) : false;

      /**
       * Ambil registrasi event untuk mendapatkan info divisi setiap peserta
       */
      const eventId = meeting?.event_id;
      const registrations = eventId
        ? await EventRegistration.findAll({
            where: { event_id: eventId, status: 1 },
            attributes: ['user_id', 'division_id'],
            include: [
              {
                model: Division,
                attributes: ['id', 'name'],
              },
            ],
          })
        : [];

      const registrationMap = new Map(
        registrations.map((reg) => [reg.user_id, reg]),
      );

      const filteredAttendances = [];

      for (const attendance of data) {
        const allowed = await this.validateAttendanceViewPermission(
          attendance.meeting,
          user,
        );

        if (allowed) {
          if (canManage || attendance.user_id === user.id) {
            const reg = registrationMap.get(attendance.user_id);
            const enriched = attendance.toJSON
              ? attendance.toJSON()
              : { ...attendance };

            if (enriched.user) {
              enriched.user.division = reg?.division ?? null;
            }

            filteredAttendances.push(enriched);
          }
        }
      }

      return this.response.success(
        {
          count: filteredAttendances.length,
          attendances: filteredAttendances,
        },
        200,
        'Successfully get attendances',
      );
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  async findOne(attendance: Attendance, user: any) {
    const attendanceWithMeeting = attendance.meeting
      ? attendance
      : await this.attendanceModel.findByPk(attendance.id, {
          include: [
            {
              model: Meeting,
              attributes: ['id', 'meeting_type', 'division_id', 'event_id'],
            },
          ],
        });

    if (!attendanceWithMeeting) {
      return this.response.fail('Attendance not found', 404);
    }

    const allowed = await this.validateAttendanceViewPermission(
      attendanceWithMeeting.meeting,
      user,
    );

    if (!allowed) {
      return this.response.fail('You cannot access this attendance', 403);
    }

    return this.response.success(
      attendanceWithMeeting,
      200,
      'Successfully get attendance',
    );
  }

  async create(createAttendaceDto: CreateAttendaceDto) {
    return this.response.fail(
      'Attendance must be created automatically when a meeting is created',
      403,
    );
  }
  async update(
    attendanceId: number,
    updateAttendaceDto: UpdateAttendaceDto,
    user: any,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const attendanceWithMeeting = await this.attendanceModel.findByPk(
        attendanceId,
        {
          include: [
            {
              model: Meeting,
              attributes: ['id', 'meeting_type', 'division_id', 'event_id'],
            },
          ],
        },
      );

      if (!attendanceWithMeeting) {
        await transaction.rollback();

        return this.response.fail('Attendance not found', 404);
      }

      const canManage = await this.validateAttendanceManagePermission(
        attendanceWithMeeting.meeting,
        user,
      );

      if (!canManage) {
        await transaction.rollback();

        return this.response.fail('You cannot manage attendance', 403);
      }

      await attendanceWithMeeting.update(updateAttendaceDto, {
        transaction,
      });

      await transaction.commit();

      const updatedAttendance = await this.attendanceModel.findByPk(
        attendanceId,
        {
          include: [
            {
              model: Meeting,
              attributes: [
                'id',
                'title',
                'meeting_type',
                'division_id',
                'event_id',
              ],
            },
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
        },
      );

      return this.response.success(
        { attendance: updatedAttendance },
        200,
        'Successfully updated attendance',
      );
    } catch (error) {
      await transaction.rollback();

      console.log(error);

      return this.response.fail(error, 400);
    }
  }

  async bulkUpdate(
    updates: { id: number; status: number }[],
    user: any,
  ) {
    if (!updates || updates.length === 0) {
      return this.response.fail('No updates provided', 400);
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Ambil semua attendance sekaligus dengan meeting info
      const ids = updates.map((u) => u.id);
      const attendances = await this.attendanceModel.findAll({
        where: { id: ids },
        include: [
          {
            model: Meeting,
            attributes: ['id', 'meeting_type', 'division_id', 'event_id'],
          },
        ],
        transaction,
      });

      if (attendances.length === 0) {
        await transaction.rollback();
        return this.response.fail('Attendances not found', 404);
      }

      // Validasi permission sekali berdasarkan meeting pertama
      const canManage = await this.validateAttendanceManagePermission(
        attendances[0].meeting,
        user,
      );

      if (!canManage) {
        await transaction.rollback();
        return this.response.fail('You cannot manage attendance', 403);
      }

      // Update semua dalam satu transaksi secara paralel
      const statusMap = new Map(updates.map((u) => [u.id, u.status]));
      await Promise.all(
        attendances.map((att) =>
          att.update({ status: statusMap.get(att.id) }, { transaction }),
        ),
      );

      await transaction.commit();

      return this.response.success(
        { updated: attendances.length },
        200,
        'Attendances updated successfully',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async remove(attendance: Attendance, user: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const attendanceWithMeeting = attendance.meeting
        ? attendance
        : await this.attendanceModel.findByPk(attendance.id, {
            include: [
              {
                model: Meeting,
                attributes: ['id', 'meeting_type', 'division_id', 'event_id'],
              },
            ],
          });

      if (!attendanceWithMeeting) {
        await transaction.rollback();
        return this.response.fail('Attendance not found', 404);
      }

      const canManage = await this.validateAttendanceManagePermission(
        attendanceWithMeeting.meeting,
        user,
      );

      if (!canManage) {
        await transaction.rollback();
        return this.response.fail('You cannot manage attendance', 403);
      }

      await attendanceWithMeeting.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Successfully deleted attendance');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async exportAttendance(meetingId: number, user: any, res: Response) {
    try {
      const attendances = await this.attendanceModel.findAll({
        where: {
          meeting_id: meetingId,
        },
        include: [
          {
            model: User,
            attributes: ['name'],
          },
          {
            model: Meeting,
            attributes: ['title'],
          },
        ],
        order: [['id', 'ASC']],
      });

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet('Absensi');

      worksheet.columns = [
        { header: 'No', key: 'no', width: 10 },
        { header: 'Nama', key: 'name', width: 30 },
        { header: 'Status', key: 'status', width: 20 },
      ];

      attendances.forEach((item, index) => {
        let statusLabel = 'Tidak Hadir';

        if (item.status === 1) {
          statusLabel = 'Hadir';
        }

        if (item.status === 2) {
          statusLabel = 'Izin';
        }

        worksheet.addRow({
          no: index + 1,
          name: item.user?.name || '-',
          status: statusLabel,
        });
      });

      worksheet.getRow(1).font = {
        bold: true,
      };

      const meetingTitle = attendances[0]?.meeting?.title || 'attendance';

      const fileName = `Absensi_Rapat_${meetingTitle}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      res.status(200);

      await workbook.xlsx.write(res);

      return;
    } catch (error) {
      console.log(error);

      if (!res.headersSent) {
        return res.status(500).json({
          message: 'Failed export attendance',
        });
      }
    }
  }
}
