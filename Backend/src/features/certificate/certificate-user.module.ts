import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Certificate } from '../certificate/entities/certificate.entity';
import { CertificateTemplate } from '../certificate/entities/certificate-template.entity';
import { CertificateTemplateField } from '../certificate/entities/certificate-template-field.entity';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { Notification } from '../notification/entities/notification.entity';
import { CertificateUserController } from '../certificate/certificate-user.controller';
import { CertificateGenerateService } from '../certificate/certificate-generate.service';
import { LocalStorageHelper } from 'src/cores/helpers/local-storage.helper';

/**
 * Standalone module for user-facing certificate routes mounted at /api/v1/certificates
 * (verify, my, download)
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
  controllers: [CertificateUserController],
  providers: [CertificateGenerateService, LocalStorageHelper],
})
export class CertificateUserModule {}
