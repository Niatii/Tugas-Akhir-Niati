import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventRegistration } from './entities/event-registration.entity';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistrationService } from './event-registration.service';
import { DivisionMember } from '../division-member/entities/division-member.entity';

@Module({
  imports: [SequelizeModule.forFeature([EventRegistration, DivisionMember])],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
})
export class EventRegistrationModule {}
