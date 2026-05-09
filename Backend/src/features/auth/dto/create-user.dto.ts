export class CreateUserDto {
  email: string;
  username: string;
  password: string;
  confirm_password?: string;
  name: string;
  nim?: string;
  jurusan_id?: number;
  prodi_id?: number;
  role?: number;
}
