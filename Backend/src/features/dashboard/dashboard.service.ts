import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col, literal } from 'sequelize';
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

  async getAdminDashboard() {
    try {
      /* ─── KPI 1: Total Events ─── */
      const totalEvents = await this.eventModel.count();

      /* ─── KPI 2: Upcoming Events (status = 1 UPCOMING) ─── */
      const upcomingEvents = await this.eventModel.count({
        where: { status: 1 },
      });

      /* ─── KPI 3: Average Attendance ─── */
      // Count all attendance slots for completed meetings (status = 2)
      const totalSlots = await this.attendanceModel.count({
        include: [
          {
            model: Meeting,
            required: true,
            where: { status: 2 }, // COMPLETED meetings only
          },
        ],
      });

      // Count attended slots (attendance status = 1 = Hadir)
      const attendedSlots = await this.attendanceModel.count({
        where: { status: 1 },
        include: [
          {
            model: Meeting,
            required: true,
            where: { status: 2 },
          },
        ],
      });

      const avgAttendance =
        totalSlots > 0 ? Math.round((attendedSlots / totalSlots) * 100) : 0;

      /* ─── Donut: Event Status Distribution ─── */
      const completedCount = await this.eventModel.count({
        where: { status: 5 },
      });
      const draftCount = await this.eventModel.count({
        where: { status: 0 },
      });
      const activeCount = await this.eventModel.count({
        where: { status: { [Op.in]: [1, 2, 3, 4] } },
      });

      /* ─── Bar: Monthly Attendance for current year ─── */
      const currentYear = new Date().getFullYear();
      const yearStart = new Date(`${currentYear}-01-01`);
      const yearEnd = new Date(`${currentYear}-12-31T23:59:59`);

      // Fetch all present attendances for meetings in the current year
      const monthlyRaw = await this.attendanceModel.findAll({
        attributes: [
          [fn('MONTH', col('meeting.schedule_date')), 'month'],
          [fn('COUNT', col('attendances.id')), 'count'],
        ],
        where: { status: 1 }, // Present
        include: [
          {
            model: Meeting,
            attributes: [],
            required: true,
            where: {
              schedule_date: { [Op.between]: [yearStart, yearEnd] },
            },
          },
        ],
        group: [fn('MONTH', col('meeting.schedule_date'))],
        raw: true,
      });

      // Build a 12-element array [Jan..Dec]
      const monthlyAttendance = Array(12).fill(0);
      for (const row of monthlyRaw as any[]) {
        const monthIndex = Number(row['month']) - 1; // MONTH() returns 1-12
        monthlyAttendance[monthIndex] = Number(row['count']);
      }

      /* ─── Response Payload ─── */
      const payload = {
        kpi: {
          totalEvents,
          avgAttendance,
          upcomingEvents,
        },
        donut: {
          // Order matches BerandaAdmin donut labels: ['Selesai', 'Draft', 'Aktif']
          series: [completedCount, draftCount, activeCount],
        },
        bar: {
          series: monthlyAttendance,
        },
      };

      return this.response.success(
        payload,
        200,
        'Successfully retrieved admin dashboard',
      );
    } catch (error) {
      return this.response.fail(error, 500);
    }
  }
}
