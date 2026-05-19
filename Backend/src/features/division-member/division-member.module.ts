import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DivisionMember } from './entities/division-member.entity';
import { DivisionMemberController } from './division-member.controller';
import { DivisionMemberService } from './division-member.service';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';

@Module({
  imports: [SequelizeModule.forFeature([DivisionMember, EventRegistration])],
  controllers: [DivisionMemberController],
  providers: [DivisionMemberService],
})
export class DivisionMemberModule {}
