import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { DivisionService } from './division.service';
import { Division } from './entities/division.entity';
import { divisionIdParamSchema } from './Validations/params/division-id.param';
import { createDivisionSchema } from './Validations/requests/create-division.request';
import { updateDivisionSchema } from './Validations/requests/update-division.request';
import type { Request } from 'express';

@Controller()
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any, @Req() req: any) {
    return this.divisionService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Req() req: any,
  ) {
    return this.divisionService.findOne(division, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createDivisionSchema))
    createDivisionDto: CreateDivisionDto,
    @Req() req: any,
  ) {
    return this.divisionService.create(createDivisionDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,

    @Body(new JoiValidationPipe(updateDivisionSchema))
    updateDivisionDto: UpdateDivisionDto,

    @Req() req: any,
  ) {
    return this.divisionService.update(division, updateDivisionDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,

    @Req() req: any,
  ) {
    return this.divisionService.remove(division, req.user);
  }
}
