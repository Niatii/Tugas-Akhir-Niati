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
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateAttendaceDto } from './dto/create-attendace.dto';
import { UpdateAttendaceDto } from './dto/update-attendace.dto';
import { Attendance } from './entities/attendace.entity';
import { AttendaceService } from './attendace.service';
import { attendaceIdParamSchema } from './validations/params/attendace-id.param';
import { createAttendaceSchema } from './validations/requests/create-attendace.request';
import { updateAttendaceSchema } from './validations/requests/update-attendace.request';
import type { Response } from 'express';

@Controller()
export class AttendaceController {
  constructor(private readonly attendaceService: AttendaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationPipe(createAttendaceSchema))
    createAttendaceDto: CreateAttendaceDto,
  ) {
    return this.attendaceService.create(createAttendaceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req: any,

    @Query() query: any,
  ) {
    return this.attendaceService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(attendaceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendaceService.findOne(attendance, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('bulk')
  bulkUpdate(
    @Req() req: any,
    @Body() body: { updates: { id: number; status: number }[] },
  ) {
    return this.attendaceService.bulkUpdate(body.updates, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() req: any,

    @Param('id') id: number,

    @Body(new JoiValidationPipe(updateAttendaceSchema))
    updateAttendaceDto: UpdateAttendaceDto,
  ) {
    return this.attendaceService.update(id, updateAttendaceDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Req() req: any,
    @Param('id', new JoiValidationParamPipe(attendaceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendaceService.remove(attendance, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export/:meetingId')
  async exportAttendance(
    @Param('meetingId') meetingId: number,
    @Req() req: any,
    @Res({ passthrough: false }) res: Response,
  ) {
    await this.attendaceService.exportAttendance(
      Number(meetingId),
      req.user,
      res,
    );
  }
}
