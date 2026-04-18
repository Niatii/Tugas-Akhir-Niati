import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Meeting } from "./entities/meeting.entity";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";

@Module({
  imports: [SequelizeModule.forFeature([Meeting])],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
