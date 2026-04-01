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
import { CreateDivisionDto } from "./dto/create-division.dto";
import { UpdateDivisionDto } from "./dto/update-division.dto";
import { DivisionService } from "./division.service";
import { Division } from "./entities/division.entity";
import { divisionIdParamSchema } from "./Validations/params/division-id.param";
import { createDivisionSchema } from "./Validations/requests/create-division.request";
import { updateDivisionSchema } from "./Validations/requests/update-division.request";

@Controller()
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.divisionService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
  ) {
    return this.divisionService.findOne(division);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createDivisionSchema))
    createDivisionDto: CreateDivisionDto,
  ) {
    return this.divisionService.create(createDivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
    @Body(new JoiValidationPipe(updateDivisionSchema))
    updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionService.update(division, updateDivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(divisionIdParamSchema))
    division: Division,
  ) {
    return this.divisionService.remove(division);
  }
}
