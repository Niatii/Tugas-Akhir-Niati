export class CreateEventRegistrationDto {
  user_id: number;
  division_id: number;
  event_id: number;
  reason?: string;
  status?: number;
  position?: string;
}
