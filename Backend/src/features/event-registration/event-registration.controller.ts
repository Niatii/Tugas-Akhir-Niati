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
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { EventRegistration } from './entities/event-registration.entity';
import { EventRegistrationService } from './event-registration.service';
import { eventRegistrationIdParamSchema } from './validations/params/event-registration-id.param';
import { createEventRegistrationSchema } from './validations/requests/create-event-registration.request';
import { updateEventRegistrationSchema } from './validations/requests/update-event-registration.request';
import type { Request } from 'express';

@Controller()
export class EventRegistrationController {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationPipe(createEventRegistrationSchema))
    createEventRegistrationDto: CreateEventRegistrationDto,
  ) {
    return this.eventRegistrationService.create(createEventRegistrationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: any, @Req() req: any) {
    return this.eventRegistrationService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.eventRegistrationService.findOne(Number(id), req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', new JoiValidationParamPipe(eventRegistrationIdParamSchema))
    eventRegistration: EventRegistration,
    @Body(new JoiValidationPipe(updateEventRegistrationSchema))
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationService.update(
      eventRegistration,
      updateEventRegistrationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', new JoiValidationParamPipe(eventRegistrationIdParamSchema))
    eventRegistration: EventRegistration,
  ) {
    return this.eventRegistrationService.remove(eventRegistration);
  }
}
