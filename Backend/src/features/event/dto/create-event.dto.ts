export class CreateEventDto {
  // user_id: number;
  title: string;
  description: string;
  image_file?: string;
  image_url?: string;
  start_date: Date;
  end_date: Date;
  registration_start: Date;
  registration_end: Date;
  status: number;
  benefit: string;
  description_divisi: string;
  requirement: string;

  divisis: CreateDivisionDto[];
}
export class CreateDivisionDto {
  name: string;
}