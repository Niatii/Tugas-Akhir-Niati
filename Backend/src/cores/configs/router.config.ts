import { RouterModule } from "@nestjs/core";
import { AuthModule } from "src/features/auth/auth.module";
import { CertificateModule } from "src/features/certificate/certificate.module";
import { DivisionMemberModule } from "src/features/division-member/division-member.module";
import { DivisionModule } from "src/features/division/division.module";
import { EventModule } from "src/features/event/event.module";
import { EventRegistrationModule } from "src/features/event-registration/event-registration.module";
import { MeetingModule } from "src/features/meeting/meeting.module";
import { MeetingNoteModule } from "src/features/meeting-note/meeting-note.module";
import { UserModule } from "src/features/user/user.module";
import { AttendaceModule } from "src/features/attendace/attendace.module";

export default RouterModule.register([
  {
    path: "/api/v1",
    children: [
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "events",
        module: EventModule,
        children: [
          {
            path: ":eventId/certificates",
            module: CertificateModule,
          },
        ],
      },
      {
        path: "divisions",
        module: DivisionModule,
        children: [
          {
            path: ":divisionId/members",
            module: DivisionMemberModule,
          },
        ],
      },
      {
        path: "meetings",
        module: MeetingModule,
      },
      {
        path: "attendances",
        module: AttendaceModule,
      },
      {
        path: "meeting-notes",
        module: MeetingNoteModule,
      },
      {
        path: "event-registrations",
        module: EventRegistrationModule,
      },
    ],
  },
]);
