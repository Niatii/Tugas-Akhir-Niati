import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventRegistration } from './entities/event-registration.entity';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistrationService } from './event-registration.service';
import { DivisionMember } from '../division-member/entities/division-member.entity';
import { Notification } from '../notification/entities/notification.entity';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [SequelizeModule.forFeature([EventRegistration, DivisionMember, Notification, Event])],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
})
export class EventRegistrationModule {}

