import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from '../event/entities/event.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { Attendance } from '../attendace/entities/attendace.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SequelizeModule.forFeature([Event, Meeting, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
