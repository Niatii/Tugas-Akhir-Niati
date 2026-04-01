export class CreateEventDto {
  user_id: number;
  title: string;
  description: string;
  image_file: string;
  image_url: string;
  start_date: Date;
  end_date: Date;
  status: number;
  benefit: string;
  requirement: string;
}
