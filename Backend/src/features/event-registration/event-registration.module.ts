import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventRegistration } from "./entities/event-registration.entity";
import { EventRegistrationController } from "./event-registration.controller";
import { EventRegistrationService } from "./event-registration.service";

@Module({
  imports: [SequelizeModule.forFeature([EventRegistration])],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
})
export class EventRegistrationModule {}
