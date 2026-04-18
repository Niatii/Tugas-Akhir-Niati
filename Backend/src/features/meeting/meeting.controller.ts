import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { Meeting } from "./entities/meeting.entity";
import { MeetingService } from "./meeting.service";
import { meetingIdParamSchema } from "./validations/params/meeting-id.param";
import { createMeetingSchema } from "./validations/requests/create-meeting.request";
import { updateMeetingSchema } from "./validations/requests/update-meeting.request";

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationPipe(createMeetingSchema))
    createMeetingDto: CreateMeetingDto,
  ) {
    return this.meetingService.create(createMeetingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.meetingService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
  ) {
    return this.meetingService.findOne(meeting);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
    @Body(new JoiValidationPipe(updateMeetingSchema))
    updateMeetingDto: UpdateMeetingDto,
  ) {
    return this.meetingService.update(meeting, updateMeetingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(meetingIdParamSchema))
    meeting: Meeting,
  ) {
    return this.meetingService.remove(meeting);
  }
}
