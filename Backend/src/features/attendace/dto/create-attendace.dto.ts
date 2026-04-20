export class CreateAttendaceDto {
  meeting_id: number;
  user_id: number;
  status?: number;
  attended_at?: Date;
}
