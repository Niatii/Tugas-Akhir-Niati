export class CreateCertificateDto {
  user_id: number;
  event_id: number;
  file_path: string;
  file_url: string;
  issued_at: Date;
}
