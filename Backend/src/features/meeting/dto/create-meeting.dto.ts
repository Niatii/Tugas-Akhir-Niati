export class CreateMeetingDto {
  event_id: number;
  division_id: number;
  title: string;
  status: number;
  date: Date;
  updated_by: number;
  schedule_date: Date;
  location: string;
  meeting_type: string;
}
