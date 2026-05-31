import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import routerConfig from "./cores/configs/router.config";
import { sequelizeConfigAsync } from "./cores/configs/sequelize.config";
import { NotificationListener } from "./cores/event-emitter/notification.listener";
import { ResponseModule } from "./cores/modules/response/response.module";
import { AttendaceModule } from './features/attendace/attendace.module';
import { AuthModule } from "./features/auth/auth.module";
import { CertificateModule } from './features/certificate/certificate.module';
import { CertificateUserModule } from './features/certificate/certificate-user.module';
import { DivisionMemberModule } from './features/division-member/division-member.module';
import { DivisionModule } from './features/division/division.module';
import { EventRegistrationModule } from './features/event-registration/event-registration.module';
import { EventModule } from './features/event/event.module';
import { MeetingNoteModule } from './features/meeting-note/meeting-note.module';
import { MeetingModule } from './features/meeting/meeting.module';
import { UserModule } from "./features/user/user.module";
import { JurusanModule } from "./features/jurusan/jurusan.module";
import { ProdiModule } from "./features/program-studi/prodi.module";
import { DashboardModule } from './features/dashboard/dashboard.module';
import { NotificationModule } from './features/notification/public/notification.module';


@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      cache: true,
    }),
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
    routerConfig,
    AuthModule,
    ResponseModule,
    UserModule,
    ScheduleModule.forRoot(),
    EventModule,
    DivisionModule,
    DivisionMemberModule,
    CertificateModule,
    CertificateUserModule,
    MeetingModule,
    AttendaceModule,
    MeetingNoteModule,
    EventRegistrationModule,
    JurusanModule,
    ProdiModule,
    DashboardModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
