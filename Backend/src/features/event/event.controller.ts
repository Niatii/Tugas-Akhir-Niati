import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";
import { EventService } from "./event.service";
import { eventIdParamSchema } from "./Validations/params/event-id.param";
import { createEventSchema } from "./Validations/requests/create-event.request";
import { updateEventSchema } from "./Validations/requests/update-event.request";

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.eventService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.findOne(event);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createEventSchema))
    createEventDto: CreateEventDto,
  ) {
    return this.eventService.create(createEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Body(new JoiValidationPipe(updateEventSchema))
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(event, updateEventDto);
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  @Post(":id/image")
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param("id", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.uploadImage(event, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.remove(event);
  }
}
