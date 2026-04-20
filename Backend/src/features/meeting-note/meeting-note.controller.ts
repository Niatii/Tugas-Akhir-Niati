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
import { CreateMeetingNoteDto } from "./dto/create-meeting-note.dto";
import { UpdateMeetingNoteDto } from "./dto/update-meeting-note.dto";
import { MeetingNote } from "./entities/meeting-note.entity";
import { MeetingNoteService } from "./meeting-note.service";
import { meetingNoteIdParamSchema } from "./validations/params/meeting-note-id.param";
import { createMeetingNoteSchema } from "./validations/requests/create-meeting-note.request";
import { updateMeetingNoteSchema } from "./validations/requests/update-meeting-note.request";

@Controller()
export class MeetingNoteController {
  constructor(private readonly meetingNoteService: MeetingNoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationPipe(createMeetingNoteSchema))
    createMeetingNoteDto: CreateMeetingNoteDto,
  ) {
    return this.meetingNoteService.create(createMeetingNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.meetingNoteService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(meetingNoteIdParamSchema))
    meetingNote: MeetingNote,
  ) {
    return this.meetingNoteService.findOne(meetingNote);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(meetingNoteIdParamSchema))
    meetingNote: MeetingNote,
    @Body(new JoiValidationPipe(updateMeetingNoteSchema))
    updateMeetingNoteDto: UpdateMeetingNoteDto,
  ) {
    return this.meetingNoteService.update(meetingNote, updateMeetingNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(meetingNoteIdParamSchema))
    meetingNote: MeetingNote,
  ) {
    return this.meetingNoteService.remove(meetingNote);
  }
}
