import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { MeetingNote } from "./entities/meeting-note.entity";
import { MeetingNoteController } from "./meeting-note.controller";
import { MeetingNoteService } from "./meeting-note.service";

@Module({
  imports: [SequelizeModule.forFeature([MeetingNote])],
  controllers: [MeetingNoteController],
  providers: [MeetingNoteService],
})
export class MeetingNoteModule {}
