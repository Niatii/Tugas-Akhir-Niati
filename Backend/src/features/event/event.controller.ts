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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';
import { eventIdParamSchema } from './Validations/params/event-id.param';
import { createEventSchema } from './Validations/requests/create-event.request';
import { updateEventSchema } from './Validations/requests/update-event.request';
import type { Request } from 'express';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/public/list')
  findPublicEvents(@Query() query: any) {
    return this.eventService.findPublicEvents(query);
  }

  @Get('/public/:id')
  findPublicOne(
    @Param('id', new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.findPublicOne(event);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my/events')
  findMyEvents(@Req() req: any) {
    return this.eventService.findMyEvents(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my/events/:id')
  findMyEventDetail(
    @Req() req: any,

    @Param('id')
    id: number,
  ) {
    return this.eventService.findMyEventDetail(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.eventService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.findOne(event, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body(new JoiValidationPipe(createEventSchema))
    createEventDto: CreateEventDto,
  ) {
    return this.eventService.create(createEventDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  async publish(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.publish(event, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Body(new JoiValidationPipe(updateEventSchema))
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(event, updateEventDto, req.user);
  }

  // @UseInterceptors(FileInterceptor("file"))
  // @UseGuards(JwtAuthGuard)
  // @Post(":id/image")
  // async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param("id", new JoiValidationParamPipe(eventIdParamSchema))
  //   event: Event,
  // ) {
  //   return this.eventService.uploadImage(event, file);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
  ) {
    return this.eventService.remove(event);
  }
}
