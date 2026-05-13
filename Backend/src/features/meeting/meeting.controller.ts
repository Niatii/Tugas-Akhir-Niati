import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { MeetingService } from './meeting.service';
import { meetingIdParamSchema } from './validations/params/meeting-id.param';
import { createMeetingSchema } from './validations/requests/create-meeting.request';
import { updateMeetingSchema } from './validations/requests/update-meeting.request';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body(new JoiValidationPipe(createMeetingSchema))
    createMeetingDto: CreateMeetingDto,
  ) {
    return this.meetingService.create(createMeetingDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.meetingService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
  ) {
    return this.meetingService.findOne(meeting, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
    @Body(new JoiValidationPipe(updateMeetingSchema))
    updateMeetingDto: UpdateMeetingDto,
  ) {
    return this.meetingService.update(meeting, updateMeetingDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
  ) {
    return this.meetingService.remove(meeting, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/start')
  startMeeting(@Param('id') id: number, @Req() req: any) {
    return this.meetingService.startMeeting(Number(id), req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/finish')
  finishMeeting(@Param('id') id: number, @Req() req: any) {
    return this.meetingService.finishMeeting(Number(id), req.user);
  }
}
