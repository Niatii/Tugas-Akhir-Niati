import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col } from 'sequelize';
import { Event } from '../event/entities/event.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { Attendance } from '../attendace/entities/attendace.entity';
import { ResponseHelper } from 'src/cores/helpers/response.helper';

@Injectable()
export class DashboardService {
  constructor(
    private response: ResponseHelper,
    @InjectModel(Event)
    private eventModel: typeof Event,
    @InjectModel(Meeting)
    private meetingModel: typeof Meeting,
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
  ) {}

  async getAdminDashboard(user: any) {
    try {
      const userId = user.id;

      const totalEvents = await this.eventModel.count({
        where: { user_id: userId },
      });

      const upcomingEvents = await this.eventModel.count({
        where: { status: 1, user_id: userId },
      });

      const totalSlots = await this.attendanceModel.count({
        include: [
          {
            model: Meeting,
            required: true,
            where: { status: 2 },
            include: [
              {
                model: Event,
                required: true,
                where: { user_id: userId },
              },
            ],
          },
        ],
      });

      const attendedSlots = await this.attendanceModel.count({
        where: { status: 1 },
        include: [
          {
            model: Meeting,
            required: true,
            where: { status: 2 },
            include: [
              {
                model: Event,
                required: true,
                where: { user_id: userId },
              },
            ],
          },
        ],
      });

      const avgAttendance =
        totalSlots > 0 ? Math.round((attendedSlots / totalSlots) * 100) : 0;

      const completedCount = await this.eventModel.count({
        where: { status: 5, user_id: userId },
      });
      const draftCount = await this.eventModel.count({
        where: { status: 0, user_id: userId },
      });
      const activeCount = await this.eventModel.count({
        where: { status: { [Op.in]: [1, 2, 3, 4] }, user_id: userId },
      });

      const currentYear = new Date().getFullYear();
      const yearStart = new Date(`${currentYear}-01-01`);
      const yearEnd = new Date(`${currentYear}-12-31T23:59:59`);

      const monthlyRaw = await this.attendanceModel.findAll({
        attributes: [
          [fn('MONTH', col('meeting.schedule_date')), 'month'],
          [fn('COUNT', col('attendances.id')), 'count'],
        ],
        where: { status: 1 },
        include: [
          {
            model: Meeting,
            attributes: [],
            required: true,
            where: {
              schedule_date: { [Op.between]: [yearStart, yearEnd] },
            },
            include: [
              {
                model: Event,
                attributes: [],
                required: true,
                where: { user_id: userId },
              },
            ],
          },
        ],
        group: [fn('MONTH', col('meeting.schedule_date'))],
        raw: true,
      });

      const monthlyAttendance = Array(12).fill(0);
      for (const row of monthlyRaw as any[]) {
        const monthIndex = Number(row['month']) - 1;
        monthlyAttendance[monthIndex] = Number(row['count']);
      }

      const payload = {
        kpi: {
          totalEvents,
          avgAttendance,
          upcomingEvents,
        },
        donut: {
          series: [completedCount, draftCount, activeCount],
        },
        bar: {
          series: monthlyAttendance,
        },
      };

      return this.response.success(
        payload,
        200,
        'Berhasil memuat beranda admin',
      );
    } catch (error) {
      return this.response.fail(error, 500);
    }
  }
}
