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
import { Event } from "../event/entities/event.entity";
import { eventIdParamSchema } from "../event/Validations/params/event-id.param";
import { CertificateService } from "./certificate.service";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { Certificate } from "./entities/certificate.entity";
import { certificateIdParamSchema } from "./validations/params/certificate-id.param";
import { createCertificateSchema } from "./validations/requests/create-certificate.request";
import { updateCertificateSchema } from "./validations/requests/update-certificate.request";

@Controller()
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Query() query: any,
  ) {
    return this.certificateService.findAll(event, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Param("id", new JoiValidationParamPipe(certificateIdParamSchema))
    certificate: Certificate,
  ) {
    return this.certificateService.findOne(certificate);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Body(new JoiValidationPipe(createCertificateSchema))
    createCertificateDto: CreateCertificateDto,
  ) {
    return this.certificateService.create(event, createCertificateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Param("id", new JoiValidationParamPipe(certificateIdParamSchema))
    certificate: Certificate,
    @Body(new JoiValidationPipe(updateCertificateSchema))
    updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(certificate, updateCertificateDto);
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  @Post(":id/file")
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Param("id", new JoiValidationParamPipe(certificateIdParamSchema))
    certificate: Certificate,
  ) {
    return this.certificateService.uploadFile(certificate, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("eventId", new JoiValidationParamPipe(eventIdParamSchema))
    event: Event,
    @Param("id", new JoiValidationParamPipe(certificateIdParamSchema))
    certificate: Certificate,
  ) {
    return this.certificateService.remove(certificate);
  }
}
