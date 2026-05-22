export class UpdateUserDto {
  name: string;
  email: string;
  username: string;
  phone_number?: string;
  nim?: string;
  batch_year?: string;
  jurusan_id?: number;
  prodi_id?: number;
  role: number;
}
