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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/sequelize';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { CertificateGenerateService } from './certificate-generate.service';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';
import { SaveTemplateFieldsDto } from './dto/certificate-template.dto';
import { Certificate, CertificateStatus } from './entities/certificate.entity';
import { Event } from '../event/entities/event.entity';

/**
 * Handles all certificate routes nested under /api/v1/events/:eventId/certificates
 * The :eventId param comes from the parent route (router.config.ts).
 */
@Controller()
export class CertificateAdminController {
  constructor(
    private readonly certService: CertificateGenerateService,
    private readonly storage: LocalStorageHelper,
    @InjectModel(Certificate)
    private readonly certificateModel: typeof Certificate,
  ) {}

  // ─────────────────────────────────────────────────────────
  // TEMPLATE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('templates')
  getTemplates(@Param('eventId') eventId: string) {
    return this.certService.getTemplates(+eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('templates/:templateId')
  getTemplate(@Param('templateId') templateId: string) {
    return this.certService.getTemplate(+templateId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('background'))
  @Post('templates')
  createTemplate(
    @Param('eventId') eventId: string,
    @Body('name') name: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.certService.createTemplate(+eventId, name, file);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('background'))
  @Put('templates/:templateId')
  updateTemplate(
    @Param('templateId') templateId: string,
    @Body() body: { name?: string; is_default?: boolean },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.certService.updateTemplate(+templateId, body, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('templates/:templateId')
  deleteTemplate(@Param('templateId') templateId: string) {
    return this.certService.deleteTemplate(+templateId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('templates/:templateId/duplicate')
  duplicateTemplate(@Param('templateId') templateId: string) {
    return this.certService.duplicateTemplate(+templateId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('templates/:templateId/set-default')
  setDefaultTemplate(
    @Param('eventId') eventId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.certService.setDefaultTemplate(+eventId, +templateId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('templates/:templateId/fields')
  saveTemplateFields(
    @Param('templateId') templateId: string,
    @Body() dto: SaveTemplateFieldsDto,
  ) {
    return this.certService.saveTemplateFields(+templateId, dto);
  }

  // ─────────────────────────────────────────────────────────
  // CERTIFICATE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get()
  getCertificatesForEvent(
    @Param('eventId') eventId: string,
    @Req() req: any,
    @Query() query: any,
  ) {
    return this.certService.getCertificatesForEvent(+eventId, req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate/:userId')
  generateOne(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.certService.generateOne(+eventId, +userId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk-generate')
  bulkGenerate(@Param('eventId') eventId: string, @Req() req: any) {
    return this.certService.bulkGenerate(+eventId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  publishCertificate(@Param('id') id: string, @Req() req: any) {
    return this.certService.publishCertificate(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish-all')
  publishAll(@Param('eventId') eventId: string, @Req() req: any) {
    return this.certService.publishAll(+eventId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-manual/:userId')
  uploadManual(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.certService.uploadManual(+eventId, +userId, file, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download-admin')
  async downloadAdmin(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const cert = await this.certificateModel.findOne({
        where: { id: +id },
        include: [{ model: Event, attributes: ['id', 'user_id'] }],
      });
      if (!cert) {
        return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
      }
      // Only published certificates can be downloaded
      if (cert.status !== CertificateStatus.PUBLISHED) {
        return res.status(400).json({ message: 'Sertifikat belum diterbitkan (publish)' });
      }
      // Admin can download any certificate (role = 0 means ADMIN per UserRoleEnum).
      if (req.user.role !== 0) {
        return res.status(403).json({ message: 'Anda tidak memiliki akses' });
      }
      if (!cert.file_path) {
        return res.status(404).json({ message: 'File belum tersedia' });
      }
      const fullPath = this.storage.getAbsolutePath(cert.file_path);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: 'File tidak ditemukan di server' });
      }
      const filename = path.basename(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = ext === '.pdf' ? 'application/pdf' : 'image/jpeg';
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      fs.createReadStream(fullPath).pipe(res);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Gagal download' });
    }
  }
}
