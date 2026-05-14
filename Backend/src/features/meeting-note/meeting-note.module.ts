import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { MeetingNote } from "./entities/meeting-note.entity";
import { MeetingNoteController } from "./meeting-note.controller";
import { MeetingNoteService } from "./meeting-note.service";
import { Meeting } from "../meeting/entities/meeting.entity";

@Module({
  imports: [SequelizeModule.forFeature([MeetingNote, Meeting])],
  controllers: [MeetingNoteController],
  providers: [MeetingNoteService],
})
export class MeetingNoteModule {}
