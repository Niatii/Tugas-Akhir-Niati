import { RouterModule } from "@nestjs/core";
import { AuthModule } from "src/features/auth/auth.module";
import { DivisionModule } from "src/features/division/division.module";
import { EventModule } from "src/features/event/event.module";
import { UserModule } from "src/features/user/user.module";

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
      },
      {
        path: "divisions",
        module: DivisionModule,
      },
    ],
  },
]);
