import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { Division } from '../division/entities/division.entity';
import { EventController } from './event.controller';
import { CertificateModule } from 'src/features/certificate/certificate.module';
import { EventService } from './event.service';
import { EventScheduler } from './event.scheduler';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { Notification } from '../notification/entities/notification.entity';
import { DivisionMember } from '../division-member/entities/division-member.entity';

@Module({
  imports: [SequelizeModule.forFeature([Event, Division, EventRegistration, Notification, DivisionMember]), CertificateModule],
  controllers: [EventController],
  providers: [EventService, EventScheduler],
})
export class EventModule {}

