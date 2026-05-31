import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Meeting } from "./entities/meeting.entity";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";
import { Attendance } from "../attendace/entities/attendace.entity";
import { Division } from "../division/entities/division.entity";
import { Event } from "../event/entities/event.entity";
import { Notification } from "../notification/entities/notification.entity";
import { MeetingNote } from "../meeting-note/entities/meeting-note.entity";
import { DivisionMember } from "../division-member/entities/division-member.entity";

@Module({
  imports: [SequelizeModule.forFeature([Meeting, Attendance, Division, Event, Notification, MeetingNote, DivisionMember])],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}

