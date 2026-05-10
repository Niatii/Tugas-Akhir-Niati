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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateDivisionMemberDto } from './dto/create-division-member.dto';
import { UpdateDivisionMemberDto } from './dto/update-division-member.dto';
import { DivisionMemberService } from './division-member.service';
import { DivisionMember } from './entities/division-member.entity';
import { divisionMemberIdParamSchema } from './Validations/params/division-member-id.param';
import { createDivisionMemberSchema } from './Validations/requests/create-division-member.request';
import { updateDivisionMemberSchema } from './Validations/requests/update-division-member.request';
import { divisionIdParamSchema } from '../division/Validations/params/division-id.param';
import { Division } from '../division/entities/division.entity';

@Controller()
export class DivisionMemberController {
  constructor(private readonly divisionMemberService: DivisionMemberService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('divisionId', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Query() query: any,
  ) {
    return this.divisionMemberService.findAll(division, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('divisionId', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Param(new JoiValidationParamPipe(divisionMemberIdParamSchema))
    divisionMember: DivisionMember,
  ) {
    return this.divisionMemberService.findOne(divisionMember);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('divisionId', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Body(new JoiValidationPipe(createDivisionMemberSchema))
    createDivisionMemberDto: CreateDivisionMemberDto,
  ) {
    return this.divisionMemberService.create(division, createDivisionMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('divisionId', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,

    @Param(new JoiValidationParamPipe(divisionMemberIdParamSchema))
    divisionMember: DivisionMember,

    @Body(new JoiValidationPipe(updateDivisionMemberSchema))
    updateDivisionMemberDto: UpdateDivisionMemberDto,
  ) {
    return this.divisionMemberService.update(
      divisionMember,
      updateDivisionMemberDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('divisionId', new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Param(new JoiValidationParamPipe(divisionMemberIdParamSchema))
    divisionMember: DivisionMember,
  ) {
    return this.divisionMemberService.remove(divisionMember);
  }
}
