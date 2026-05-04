import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Event } from "./entities/event.entity";
import { Division } from "../division/entities/division.entity";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";

@Module({
  imports: [SequelizeModule.forFeature([Event, Division])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
