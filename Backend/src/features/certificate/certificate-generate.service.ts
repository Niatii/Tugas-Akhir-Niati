import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as QRCode from 'qrcode';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { Op } from 'sequelize';

import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';
import { Certificate, CertificateStatus } from './entities/certificate.entity';
import { CertificateTemplate } from './entities/certificate-template.entity';
import { CertificateTemplateField } from './entities/certificate-template-field.entity';
import { Event } from '../event/entities/event.entity';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { Attendance } from '../attendace/entities/attendace.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { User } from '../user/entities/user.entity';
import { Division } from '../division/entities/division.entity';
import { SaveTemplateFieldsDto } from './dto/certificate-template.dto';
import { Notification } from '../notification/entities/notification.entity';
import EventStatusEnum from '../event/enums/event-status.enum';

@Injectable()
export class CertificateGenerateService {
  constructor(
    @InjectModel(Certificate)
    private readonly certificateModel: typeof Certificate,
    @InjectModel(CertificateTemplate)
    private readonly templateModel: typeof CertificateTemplate,
    @InjectModel(CertificateTemplateField)
    private readonly templateFieldModel: typeof CertificateTemplateField,
    @InjectModel(EventRegistration)
    private readonly registrationModel: typeof EventRegistration,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    private readonly response: ResponseHelper,
    private readonly storage: LocalStorageHelper,
    private readonly sequelize: Sequelize,
  ) {}

  // ─────────────────────────────────────────────────────────
  // TEMPLATE MANAGEMENT
  // ─────────────────────────────────────────────────────────

  async getTemplates(eventId: number) {
    try {
      const templates = await this.templateModel.findAll({
        where: { event_id: eventId },
        include: [{ model: CertificateTemplateField }],
        order: [['created_at', 'DESC']],
      });
      const publishedCount = await this.certificateModel.count({
        where: { event_id: eventId, status: CertificateStatus.PUBLISHED },
      });
      const hasPublished = publishedCount > 0;
      return this.response.success({ count: templates.length, templates, has_published_certificates: hasPublished }, 200, 'OK');
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  async getTemplate(templateId: number) {
    try {
      const template = await this.templateModel.findByPk(templateId, {
        include: [{ model: CertificateTemplateField, order: [['z_index', 'ASC']] }],
      });
      if (!template) return this.response.fail('Template tidak ditemukan', 404);
      return this.response.success(template, 200, 'OK');
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  async createTemplate(eventId: number, name: string, file?: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      if (!name || !name.trim()) {
        await transaction.rollback();
        return this.response.fail('Nama template wajib diisi', 400);
      }
      if (!file) {
        await transaction.rollback();
        return this.response.fail('Background template wajib diunggah', 400);
      }
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
        await transaction.rollback();
        return this.response.fail('Format file background harus jpeg, jpg, atau png', 400);
      }

      // Check if active template already exists
      const activeTemplate = await this.templateModel.findOne({
        where: { event_id: eventId, is_default: true },
        transaction,
      });
      if (activeTemplate) {
        await transaction.rollback();
        return this.response.fail('Template aktif sudah ada. Hapus template aktif terlebih dahulu.', 400);
      }

      const saved = await this.storage.saveMulterFile(file, 'templates');
      const background_file = saved.filePath;
      const background_url = saved.fileUrl;

      const template = await this.templateModel.create(
        { event_id: eventId, name, background_file, background_url, is_default: false },
        { transaction },
      );

      // Auto-set as default if first template
      const count = await this.templateModel.count({ where: { event_id: eventId }, transaction });
      if (count === 1) {
        await template.update({ is_default: true }, { transaction });
      }

      await transaction.commit();
      return this.response.success({ template }, 201, 'Template berhasil dibuat');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async updateTemplate(templateId: number, data: { name?: string; is_default?: boolean }, file?: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const template = await this.templateModel.findByPk(templateId, { transaction });
      if (!template) {
        await transaction.rollback();
        return this.response.fail('Template tidak ditemukan', 404);
      }

      // Check if certificates are already published
      const publishedCount = await this.certificateModel.count({
        where: { event_id: template.event_id, status: CertificateStatus.PUBLISHED },
        transaction,
      });
      if (publishedCount > 0) {
        await transaction.rollback();
        return this.response.fail('Template tidak dapat diperbarui karena sertifikat sudah diterbitkan.', 400);
      }

      if (data.name !== undefined && (!data.name || !data.name.trim())) {
        await transaction.rollback();
        return this.response.fail('Nama template tidak boleh kosong', 400);
      }

      if (data.is_default !== undefined) {
        data.is_default = String(data.is_default) === 'true';
      }

      if (file) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
          await transaction.rollback();
          return this.response.fail('Format file background harus jpeg, jpg, atau png', 400);
        }

        // Delete old background
        if (template.background_file) {
          this.storage.deleteFile(template.background_file);
        }
        const saved = await this.storage.saveMulterFile(file, 'templates');
        data['background_file'] = saved.filePath;
        data['background_url'] = saved.fileUrl;
      }

      await template.update(data, { transaction });
      await transaction.commit();
      return this.response.success({ template }, 200, 'Template berhasil diperbarui');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async deleteTemplate(templateId: number) {
    const transaction = await this.sequelize.transaction();
    try {
      const template = await this.templateModel.findByPk(templateId, { transaction });
      if (!template) {
        await transaction.rollback();
        return this.response.fail('Template tidak ditemukan', 404);
      }

      // Check if certificates are already published
      const publishedCount = await this.certificateModel.count({
        where: { event_id: template.event_id, status: CertificateStatus.PUBLISHED },
        transaction,
      });
      if (publishedCount > 0) {
        await transaction.rollback();
        return this.response.fail('Template tidak dapat dihapus karena sertifikat sudah diterbitkan.', 400);
      }

      if (template.background_file) {
        this.storage.deleteFile(template.background_file);
      }

      await this.templateFieldModel.destroy({ where: { template_id: templateId }, transaction });
      await template.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Template berhasil dihapus');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async duplicateTemplate(templateId: number) {
    const transaction = await this.sequelize.transaction();
    try {
      const original = await this.templateModel.findByPk(templateId, {
        include: [{ model: CertificateTemplateField }],
      });
      if (!original) {
        await transaction.rollback();
        return this.response.fail('Template tidak ditemukan', 404);
      }

      const copy = await this.templateModel.create(
        {
          event_id: original.event_id,
          name: `${original.name} (Copy)`,
          background_file: original.background_file,
          background_url: original.background_url,
          is_default: false,
        },
        { transaction },
      );

      if (original.fields?.length) {
        const fieldsCopy = original.fields.map((f) => ({
          template_id: copy.id,
          field_type: f.field_type,
          label: f.label,
          pos_x: f.pos_x,
          pos_y: f.pos_y,
          width: f.width,
          height: f.height,
          font_size: f.font_size,
          font_family: f.font_family,
          color: f.color,
          rotation: f.rotation,
          alignment: f.alignment,
          z_index: f.z_index,
        }));
        await this.templateFieldModel.bulkCreate(fieldsCopy, { transaction });
      }

      await transaction.commit();
      return this.response.success({ template: copy }, 201, 'Template berhasil diduplikasi');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async setDefaultTemplate(eventId: number, templateId: number) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.templateModel.update(
        { is_default: false },
        { where: { event_id: eventId }, transaction },
      );
      await this.templateModel.update(
        { is_default: true },
        { where: { id: templateId, event_id: eventId }, transaction },
      );
      await transaction.commit();
      return this.response.success({}, 200, 'Default template berhasil diatur');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async saveTemplateFields(templateId: number, dto: SaveTemplateFieldsDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const template = await this.templateModel.findByPk(templateId, { transaction });
      if (!template) {
        await transaction.rollback();
        return this.response.fail('Template tidak ditemukan', 404);
      }

      // Check if certificates are already published
      const publishedCount = await this.certificateModel.count({
        where: { event_id: template.event_id, status: CertificateStatus.PUBLISHED },
        transaction,
      });
      if (publishedCount > 0) {
        await transaction.rollback();
        return this.response.fail('Konfigurasi field tidak dapat disimpan karena sertifikat sudah diterbitkan.', 400);
      }

      // Remove all existing fields then re-insert
      await this.templateFieldModel.destroy({ where: { template_id: templateId }, transaction });

      if (dto.fields?.length) {
        const rows = dto.fields.map((f, idx) => ({
          template_id: templateId,
          field_type: f.field_type,
          label: f.label || null,
          pos_x: f.pos_x ?? 0,
          pos_y: f.pos_y ?? 0,
          width: f.width ?? null,
          height: f.height ?? null,
          font_size: f.font_size ?? 16,
          font_family: f.font_family ?? 'Arial',
          color: f.color ?? '#000000',
          rotation: f.rotation ?? 0,
          alignment: f.alignment ?? 'left',
          z_index: f.z_index ?? idx,
        }));
        await this.templateFieldModel.bulkCreate(rows, { transaction });
      }

      await transaction.commit();
      return this.response.success({}, 200, 'Layout field berhasil disimpan');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // ATTENDANCE CALCULATION
  // ─────────────────────────────────────────────────────────

  /**
   * Calculate attendance percentage for a user in an event.
   * Counts general meetings + division meetings for user's division.
   */
  async calculateAttendance(userId: number, eventId: number): Promise<number> {
    const registration = await this.registrationModel.findOne({
      where: { user_id: userId, event_id: eventId, status: 1 },
    });
    if (!registration) return 0;

    const divisionId = registration.division_id;

    // All meetings user should attend: general + their division's meetings
    const meetings = await Meeting.findAll({
      where: {
        event_id: eventId,
        [Op.or]: [{ division_id: null }, { division_id: divisionId }],
      },
    });

    if (!meetings.length) return 0;

    const meetingIds = meetings.map((m) => m.id);

    const hadirCount = await Attendance.count({
      where: {
        user_id: userId,
        meeting_id: { [Op.in]: meetingIds },
        status: 1, // Hadir
      },
    });

    return Math.round((hadirCount / meetings.length) * 100);
  }

  // ─────────────────────────────────────────────────────────
  // GENERATE CERTIFICATE
  // ─────────────────────────────────────────────────────────

  private generateCertificateNumber(eventId: number, sequence: number): string {
    const year = new Date().getFullYear();
    const seq = String(sequence).padStart(4, '0');
    return `CERT/${eventId}/${year}/${seq}`;
  }

  async generateOne(eventId: number, userId: number, adminUser: any) {
    const transaction = await this.sequelize.transaction();
    try {
      // Validate event is completed
      const event = await Event.findByPk(eventId, { include: [{ model: User, attributes: ['id', 'name'] }] });
      if (!event) {
        await transaction.rollback();
        return this.response.fail('Event tidak ditemukan', 404);
      }
      if (event.status !== EventStatusEnum.COMPLETED) {
        await transaction.rollback();
        return this.response.fail('Event belum selesai. Generate sertifikat tidak dapat dilakukan.', 400);
      }
      if (event.user_id !== adminUser.id) {
        await transaction.rollback();
        return this.response.fail('Anda tidak memiliki akses', 403);
      }

      // Get template
      const template = await this.templateModel.findOne({
        where: { event_id: eventId, is_default: true },
        include: [{ model: CertificateTemplateField }],
      });
      if (!template) {
        await transaction.rollback();
        return this.response.fail('Template belum diatur. Buat template terlebih dahulu.', 400);
      }

      // Get registration
      const registration = await this.registrationModel.findOne({
        where: { user_id: userId, event_id: eventId, status: 1 },
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Division, attributes: ['id', 'name'] },
        ],
      });
      if (!registration) {
        await transaction.rollback();
        return this.response.fail('User bukan peserta aktif event ini', 400);
      }

      // Check if manual certificate exists (priority)
      const manualCert = await this.certificateModel.findOne({
        where: { user_id: userId, event_id: eventId, is_manual: true },
      });
      if (manualCert) {
        await transaction.rollback();
        return this.response.fail('User memiliki sertifikat manual. Gunakan sertifikat manual tersebut.', 400);
      }

      // Calculate attendance
      const percentage = await this.calculateAttendance(userId, eventId);
      if (percentage <= 75) {
        await transaction.rollback();
        return this.response.fail(
          `Kehadiran ${percentage}% di bawah syarat minimal 75%. Sertifikat tidak dapat digenerate.`,
          400,
        );
      }

      // Check existing certificate
      let certificate = await this.certificateModel.findOne({
        where: { user_id: userId, event_id: eventId, is_manual: false },
        transaction,
      });

      if (certificate && certificate.status === CertificateStatus.PUBLISHED) {
        await transaction.rollback();
        return this.response.fail('Sertifikat sudah diterbitkan dan tidak dapat digenerate ulang.', 400);
      }

      // Generate certificate number if new
      let certNumber: string;
      if (!certificate) {
        const count = await this.certificateModel.count({ where: { event_id: eventId }, transaction });
        certNumber = this.generateCertificateNumber(eventId, count + 1);
      } else {
        certNumber = certificate.certificate_number;
      }

      // Generate QR code
      const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify/${certNumber}`;
      const qrBuffer = await this.generateQrCode(verificationUrl);
      const qrSaved = await this.storage.saveFile(qrBuffer, 'qrcodes', `${certNumber.replace(/\//g, '-')}.png`);

      // Generate PDF
      const pdfBuffer = await this.renderCertificatePdf({
        certificateNumber: certNumber,
        userName: registration.user.name,
        eventName: event.title,
        eventDate: event.start_date,
        position: registration.position || 'Peserta',
        division: registration.division?.name || '',
        organization: registration.user.name,
        year: new Date().getFullYear().toString(),
        qrPath: this.storage.getAbsolutePath(qrSaved.filePath),
        attendancePercentage: percentage,
      }, template);

      const pdfSaved = await this.storage.saveFile(pdfBuffer, 'certificates', `${certNumber.replace(/\//g, '-')}.pdf`);

      if (certificate) {
        // Delete old PDF
        if (certificate.file_path) {
          this.storage.deleteFile(certificate.file_path);
        }
        await certificate.update(
          {
            certificate_number: certNumber,
            attendance_percentage: percentage,
            file_path: pdfSaved.filePath,
            file_url: pdfSaved.fileUrl,
            status: CertificateStatus.GENERATED,
            issued_at: new Date(),
            template_id: template.id,
          },
          { transaction },
        );
      } else {
        certificate = await this.certificateModel.create(
          {
            user_id: userId,
            event_id: eventId,
            certificate_number: certNumber,
            attendance_percentage: percentage,
            file_path: pdfSaved.filePath,
            file_url: pdfSaved.fileUrl,
            status: CertificateStatus.GENERATED,
            issued_at: new Date(),
            is_manual: false,
            template_id: template.id,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success({ certificate }, 200, 'Sertifikat berhasil digenerate');
    } catch (error) {
      await transaction.rollback();
      console.error('[CertificateGenerate] generateOne error:', error);
      return this.response.fail(error?.message || 'Gagal generate sertifikat', 400);
    }
  }

  async bulkGenerate(eventId: number, adminUser: any) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) return this.response.fail('Event tidak ditemukan', 404);
      if (event.status !== EventStatusEnum.COMPLETED) {
        return this.response.fail('Event belum selesai', 400);
      }
      if (event.user_id !== adminUser.id) {
        return this.response.fail('Anda tidak memiliki akses', 403);
      }

      const template = await this.templateModel.findOne({
        where: { event_id: eventId, is_default: true },
        include: [{ model: CertificateTemplateField }],
      });
      if (!template) return this.response.fail('Template belum diatur. Buat template terlebih dahulu.', 400);

      // Get all approved members
      const registrations = await this.registrationModel.findAll({
        where: { event_id: eventId, status: 1 },
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Division, attributes: ['id', 'name'] },
        ],
      });

      const results = {
        success: [],
        failed: [],
      };

      for (const reg of registrations) {
        // Skip if manual cert exists
        const manualCert = await this.certificateModel.findOne({
          where: { user_id: reg.user_id, event_id: eventId, is_manual: true },
        });
        if (manualCert) {
          results.success.push({ user: reg.user.name, reason: 'Manual certificate exists' });
          continue;
        }

        const percentage = await this.calculateAttendance(reg.user_id, eventId);

        if (percentage <= 75) {
          results.failed.push({
            user_id: reg.user_id,
            name: reg.user.name,
            email: reg.user.email,
            attendance_percentage: percentage,
            reason: `Kehadiran ${percentage}% di bawah syarat minimal 75%`,
          });
          continue;
        }

        try {
          const resp = await this.generateOne(eventId, reg.user_id, adminUser);
          if ((resp as any).statusCode >= 400) {
            results.failed.push({
              user_id: reg.user_id,
              name: reg.user.name,
              reason: (resp as any).message,
              attendance_percentage: percentage,
            });
          } else {
            results.success.push({ user_id: reg.user_id, name: reg.user.name });
          }
        } catch (e) {
          results.failed.push({
            user_id: reg.user_id,
            name: reg.user.name,
            reason: e?.message || 'Error tidak diketahui',
            attendance_percentage: percentage,
          });
        }
      }

      return this.response.success(
        {
          total: registrations.length,
          generated: results.success.length,
          failed: results.failed.length,
          success_list: results.success,
          failed_list: results.failed,
        },
        200,
        `Bulk generate selesai. Berhasil: ${results.success.length}, Gagal: ${results.failed.length}`,
      );
    } catch (error) {
      console.error('[CertificateGenerate] bulkGenerate error:', error);
      return this.response.fail(error?.message || 'Gagal bulk generate', 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // QR CODE GENERATION
  // ─────────────────────────────────────────────────────────

  async generateQrCode(url: string): Promise<Buffer> {
    return await QRCode.toBuffer(url, {
      type: 'png',
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    });
  }

  // ─────────────────────────────────────────────────────────
  // PDF RENDERING (Puppeteer)
  // ─────────────────────────────────────────────────────────

  async renderCertificatePdf(data: {
    certificateNumber: string;
    userName: string;
    eventName: string;
    eventDate: Date;
    position: string;
    division: string;
    organization: string;
    year: string;
    qrPath: string;
    attendancePercentage?: number;
  }, template: CertificateTemplate): Promise<Buffer> {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const bgUrl = template.background_url
      ? `${baseUrl}${template.background_url}`
      : null;

    const formatDate = (d: Date) => {
      if (!d) return '-';
      return new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    };

    // Read QR as base64
    let qrBase64 = '';
    try {
      const qrBuf = fs.readFileSync(data.qrPath);
      qrBase64 = `data:image/png;base64,${qrBuf.toString('base64')}`;
    } catch { /* no QR */ }

    // Build field values map
    const fieldValues: Record<string, string> = {
      nama_peserta: data.userName,
      nama_acara: data.eventName,
      tanggal_acara: formatDate(data.eventDate),
      jabatan: data.position,
      divisi: data.division,
      nomor_sertifikat: data.certificateNumber,
      nama_organisasi: data.organization,
      tahun: data.year,
      predikat: '',
      qr_code: qrBase64 ? `<img src="${qrBase64}" style="width:100%;height:100%;object-fit:contain;" />` : '',
      ttd_digital: '',
    };

    // Build HTML with absolutely positioned fields overlaid on background
    const fieldsHtml = (template.fields || [])
      .sort((a, b) => (a.z_index || 0) - (b.z_index || 0))
      .map((f) => {
        const isImage = f.field_type === 'qr_code' || f.field_type === 'ttd_digital';
        const content = fieldValues[f.field_type] ?? (f.label || f.field_type);
        const style = [
          `position:absolute`,
          `left:${f.pos_x}px`,
          `top:${f.pos_y}px`,
          f.width ? `width:${f.width}px` : '',
          f.height ? `height:${f.height}px` : '',
          isImage ? '' : `font-size:${f.font_size || 16}px`,
          isImage ? '' : `font-family:${f.font_family || 'Arial'}`,
          isImage ? '' : `color:${f.color || '#000000'}`,
          isImage ? '' : `text-align:${f.alignment || 'left'}`,
          f.rotation ? `transform:rotate(${f.rotation}deg)` : '',
          `z-index:${f.z_index || 0}`,
        ].filter(Boolean).join(';');

        if (isImage) {
          return `<div style="${style}">${content}</div>`;
        }
        return `<div style="${style}">${content}</div>`;
      })
      .join('\n');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 297mm; height: 210mm; overflow: hidden; }
    .cert-container {
      position: relative;
      width: 297mm;
      height: 210mm;
      ${bgUrl ? `background: url('${bgUrl}') no-repeat center center / cover;` : 'background: #f5f0e8;'}
    }
  </style>
</head>
<body>
  <div class="cert-container">
    ${fieldsHtml}
  </div>
</body>
</html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      const pdfBuffer = await page.pdf({
        width: '297mm',
        height: '210mm',
        printBackground: true,
      });
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  // ─────────────────────────────────────────────────────────
  // PUBLISH
  // ─────────────────────────────────────────────────────────

  async publishCertificate(certificateId: number, adminUser: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const certificate = await this.certificateModel.findByPk(certificateId, {
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Event, attributes: ['id', 'title', 'user_id'] },
        ],
        transaction,
      });

      if (!certificate) {
        await transaction.rollback();
        return this.response.fail('Sertifikat tidak ditemukan', 404);
      }

      if (certificate.event.user_id !== adminUser.id) {
        await transaction.rollback();
        return this.response.fail('Anda tidak memiliki akses', 403);
      }

      if (certificate.status === CertificateStatus.DRAFT) {
        await transaction.rollback();
        return this.response.fail('Sertifikat belum digenerate. Generate terlebih dahulu.', 400);
      }

      if (certificate.status === CertificateStatus.PUBLISHED) {
        await transaction.rollback();
        return this.response.fail('Sertifikat sudah dipublikasikan.', 400);
      }

      await certificate.update(
        { status: CertificateStatus.PUBLISHED, published_at: new Date() },
        { transaction },
      );

      // Send in-app notification
      await this.notificationModel.create(
        {
          type: 'certificate_published',
          notified_user_id: certificate.user_id,
          data: JSON.stringify({
            certificate_id: certificate.id,
            event_name: certificate.event.title,
            certificate_number: certificate.certificate_number,
          }),
          message: `Sertifikat Anda untuk acara "${certificate.event.title}" telah diterbitkan. Silakan unduh sekarang.`,
        },
        { transaction },
      );

      await transaction.commit();
      return this.response.success({ certificate }, 200, 'Sertifikat berhasil dipublish');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  async publishAll(eventId: number, adminUser: any) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) return this.response.fail('Event tidak ditemukan', 404);
      if (event.user_id !== adminUser.id) return this.response.fail('Anda tidak memiliki akses', 403);

      const generated = await this.certificateModel.findAll({
        where: { event_id: eventId, status: CertificateStatus.GENERATED },
      });

      let publishedCount = 0;
      for (const cert of generated) {
        await this.publishCertificate(cert.id, adminUser);
        publishedCount++;
      }

      return this.response.success(
        { published: publishedCount },
        200,
        `${publishedCount} sertifikat berhasil dipublish`,
      );
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // MANUAL UPLOAD
  // ─────────────────────────────────────────────────────────

  async uploadManual(eventId: number, userId: number, file: Express.Multer.File, adminUser: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        await transaction.rollback();
        return this.response.fail('Event tidak ditemukan', 404);
      }
      if (event.user_id !== adminUser.id) {
        await transaction.rollback();
        return this.response.fail('Anda tidak memiliki akses', 403);
      }

      const existing = await this.certificateModel.findOne({
        where: { user_id: userId, event_id: eventId, is_manual: true },
        transaction,
      });

      const count = await this.certificateModel.count({ where: { event_id: eventId }, transaction });
      const certNumber = this.generateCertificateNumber(eventId, count + 1);

      const saved = await this.storage.saveMulterFile(file, 'certificates/manual');

      if (existing) {
        if (existing.file_path) this.storage.deleteFile(existing.file_path);
        await existing.update(
          {
            file_path: saved.filePath,
            file_url: saved.fileUrl,
            status: CertificateStatus.GENERATED,
            issued_at: new Date(),
          },
          { transaction },
        );
        await transaction.commit();
        return this.response.success({ certificate: existing }, 200, 'Sertifikat manual berhasil diperbarui');
      }

      const certificate = await this.certificateModel.create(
        {
          user_id: userId,
          event_id: eventId,
          certificate_number: certNumber,
          file_path: saved.filePath,
          file_url: saved.fileUrl,
          status: CertificateStatus.GENERATED,
          issued_at: new Date(),
          is_manual: true,
          attendance_percentage: null,
        },
        { transaction },
      );

      await transaction.commit();
      return this.response.success({ certificate }, 201, 'Sertifikat manual berhasil diupload');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error?.message || error, 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // ATTENDANCE LIST FOR ADMIN
  // ─────────────────────────────────────────────────────────

  async getCertificatesForEvent(eventId: number, adminUser: any, query: any) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) return this.response.fail('Event tidak ditemukan', 404);
      if (event.user_id !== adminUser.id) return this.response.fail('Anda tidak memiliki akses', 403);

      // Get all approved members + their certificate if exists
      const registrations = await this.registrationModel.findAll({
        where: { event_id: eventId, status: 1 },
        include: [
          { model: User, attributes: ['id', 'name', 'email', 'url'] },
          { model: Division, attributes: ['id', 'name'] },
        ],
      });

      const certMap = new Map<number, Certificate>();
      const certs = await this.certificateModel.findAll({
        where: { event_id: eventId },
      });
      for (const c of certs) {
        // Manual cert takes priority
        if (c.is_manual) {
          certMap.set(c.user_id, c);
        } else if (!certMap.has(c.user_id)) {
          certMap.set(c.user_id, c);
        }
      }

      const result = await Promise.all(
        registrations.map(async (reg) => {
          const cert = certMap.get(reg.user_id) || null;
          const attendance = await this.calculateAttendance(reg.user_id, eventId);
          return {
            user_id: reg.user_id,
            name: reg.user.name,
            email: reg.user.email,
            avatar_url: reg.user.url || null,
            position: reg.position,
            division: reg.division?.name,
            attendance_percentage: attendance,
            is_eligible: attendance > 75,
            certificate: cert
              ? {
                  id: cert.id,
                  certificate_number: cert.certificate_number,
                  status: cert.status,
                  status_name: cert.status_name,
                  is_manual: cert.is_manual,
                  file_url: cert.file_url,
                  published_at: cert.published_at,
                  issued_at: cert.issued_at,
                }
              : null,
          };
        }),
      );

      const summary = {
        total: result.length,
        eligible: result.filter((r) => r.is_eligible).length,
        generated: result.filter((r) => r.certificate?.status >= CertificateStatus.GENERATED).length,
        published: result.filter((r) => r.certificate?.status === CertificateStatus.PUBLISHED).length,
        not_generated: result.filter((r) => !r.certificate || r.certificate.status === CertificateStatus.DRAFT).length,
      };

      return this.response.success({ summary, members: result }, 200, 'OK');
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // USER DASHBOARD
  // ─────────────────────────────────────────────────────────

  async getMyCertificates(userId: number) {
    try {
      const certs = await this.certificateModel.findAll({
        where: {
          user_id: userId,
          status: CertificateStatus.PUBLISHED,
        },
        include: [
          { model: Event, attributes: ['id', 'title', 'start_date', 'end_date'] },
        ],
        order: [['published_at', 'DESC']],
      });

      return this.response.success({ count: certs.length, certificates: certs }, 200, 'OK');
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }

  // ─────────────────────────────────────────────────────────
  // VERIFICATION (PUBLIC)
  // ─────────────────────────────────────────────────────────

  async verifyCertificate(certificateNumber: string) {
    try {
      const cert = await this.certificateModel.findOne({
        where: { certificate_number: certificateNumber },
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Event, attributes: ['id', 'title', 'start_date', 'end_date'] },
        ],
      });

      if (!cert) {
        return this.response.success(
          { valid: false, message: 'Sertifikat tidak ditemukan atau tidak valid' },
          200,
          'Sertifikat tidak ditemukan',
        );
      }

      if (cert.status !== CertificateStatus.PUBLISHED) {
        return this.response.success(
          { valid: false, message: 'Sertifikat belum dipublikasikan' },
          200,
          'Sertifikat belum dipublikasikan',
        );
      }

      return this.response.success(
        {
          valid: true,
          certificate_number: cert.certificate_number,
          recipient_name: cert.user.name,
          event_name: cert.event.title,
          event_date: cert.event.start_date,
          issued_at: cert.issued_at,
          published_at: cert.published_at,
          is_manual: cert.is_manual,
        },
        200,
        'Sertifikat valid',
      );
    } catch (error) {
      return this.response.fail(error?.message || error, 400);
    }
  }
}
