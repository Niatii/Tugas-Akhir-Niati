import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { CertificateGenerateService } from './certificate-generate.service';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';

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
      const { Certificate } = await import('./entities/certificate.entity');
      const cert = await Certificate.findOne({
        where: { id: +id, user_id: req.user.id },
      });
      if (!cert || !cert.file_path) {
        return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
      }
      const fullPath = this.storage.getAbsolutePath(cert.file_path);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: 'File sertifikat tidak ditemukan' });
      }
      const filename = path.basename(fullPath);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/pdf');
      fs.createReadStream(fullPath).pipe(res);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Gagal download' });
    }
  }
}
