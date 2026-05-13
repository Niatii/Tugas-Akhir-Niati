import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Meeting } from "./entities/meeting.entity";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";
import { Attendance } from "../attendace/entities/attendace.entity";
import { Division } from "../division/entities/division.entity";
import { Event } from "../event/entities/event.entity";

@Module({
  imports: [SequelizeModule.forFeature([Meeting, Attendance, Division, Event])],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
