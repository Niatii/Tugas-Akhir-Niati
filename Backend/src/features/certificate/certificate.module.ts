import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Certificate } from "./entities/certificate.entity";
import { CertificateController } from "./certificate.controller";
import { CertificateService } from "./certificate.service";

@Module({
  imports: [SequelizeModule.forFeature([Certificate])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
