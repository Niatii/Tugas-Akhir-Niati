import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attendance } from "./entities/attendace.entity";
import { AttendaceController } from "./attendace.controller";
import { AttendaceService } from "./attendace.service";

@Module({
  imports: [SequelizeModule.forFeature([Attendance])],
  controllers: [AttendaceController],
  providers: [AttendaceService],
})
export class AttendaceModule {}
