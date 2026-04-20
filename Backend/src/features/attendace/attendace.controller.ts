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
import { CreateAttendaceDto } from "./dto/create-attendace.dto";
import { UpdateAttendaceDto } from "./dto/update-attendace.dto";
import { Attendance } from "./entities/attendace.entity";
import { AttendaceService } from "./attendace.service";
import { attendaceIdParamSchema } from "./validations/params/attendace-id.param";
import { createAttendaceSchema } from "./validations/requests/create-attendace.request";
import { updateAttendaceSchema } from "./validations/requests/update-attendace.request";

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
  findAll(@Query() query: any) {
    return this.attendaceService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(attendaceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendaceService.findOne(attendance);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(attendaceIdParamSchema))
    attendance: Attendance,
    @Body(new JoiValidationPipe(updateAttendaceSchema))
    updateAttendaceDto: UpdateAttendaceDto,
  ) {
    return this.attendaceService.update(attendance, updateAttendaceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(attendaceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendaceService.remove(attendance);
  }
}
