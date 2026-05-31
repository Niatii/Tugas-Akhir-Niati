import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Certificate } from './entities/certificate.entity';
import { CertificateTemplate } from './entities/certificate-template.entity';
import { CertificateTemplateField } from './entities/certificate-template-field.entity';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { Notification } from '../notification/entities/notification.entity';
import { CertificateAdminController } from './certificate-admin.controller';
import { CertificateGenerateService } from './certificate-generate.service';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';

/**
 * Admin certificate module mounted under /api/v1/events/:eventId/certificates
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      Certificate,
      CertificateTemplate,
      CertificateTemplateField,
      EventRegistration,
      Notification,
    ]),
  ],
  controllers: [CertificateAdminController],
  providers: [CertificateGenerateService, LocalStorageHelper],
  exports: [CertificateGenerateService, LocalStorageHelper],
})
export class CertificateModule {}
