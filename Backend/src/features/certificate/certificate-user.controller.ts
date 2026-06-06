import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { CertificateGenerateService } from './certificate-generate.service';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';
import { Certificate, CertificateStatus } from './entities/certificate.entity';

/**
 * Handles user-facing certificate routes under /api/v1/certificates
 * - GET  /certificates/my           → user's published certificates
 * - GET  /certificates/verify/:num  → public verification (no auth)
 * - GET  /certificates/:id/download → download own certificate
 */
@Controller()
export class CertificateUserController {
  constructor(
    private readonly certService: CertificateGenerateService,
    private readonly storage: LocalStorageHelper,
    @InjectModel(Certificate)
    private readonly certificateModel: typeof Certificate,
  ) {}

  // ─────────────────────────────────────────────────────────
  // PUBLIC — Verification (no auth)
  // ─────────────────────────────────────────────────────────

  @Get('verify/:number')
  verifyCertificate(@Param('number') number: string) {
    return this.certService.verifyCertificate(number);
  }

  // ─────────────────────────────────────────────────────────
  // USER — My Certificates
  // ─────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyCertificates(@Req() req: any) {
    return this.certService.getMyCertificates(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadCertificate(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const cert = await this.certificateModel.findOne({
        where: { id: +id, user_id: req.user.id },
      });

      if (!cert) {
        return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
      }

      // Hanya sertifikat yang sudah dipublish yang bisa didownload
      if (cert.status !== CertificateStatus.PUBLISHED) {
        return res.status(403).json({ message: 'Sertifikat belum dipublikasikan oleh admin' });
      }

      if (!cert.file_path) {
        return res.status(404).json({ message: 'File sertifikat tidak ditemukan' });
      }

      const fullPath = this.storage.getAbsolutePath(cert.file_path);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: 'File sertifikat tidak ditemukan di server' });
      }

      const filename = path.basename(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = ext === '.pdf'
        ? 'application/pdf'
        : ext === '.png'
          ? 'image/png'
          : ext === '.gif'
            ? 'image/gif'
            : 'image/jpeg';

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      fs.createReadStream(fullPath).pipe(res);
    } catch (e: any) {
      console.error('[DownloadCertificate Exception]', e);
      return res.status(500).json({ message: e?.message || 'Gagal download' });
    }
  }
}
