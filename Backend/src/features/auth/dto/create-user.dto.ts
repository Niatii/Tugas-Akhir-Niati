import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Email wajib diisi',
  })
  @IsEmail(
    {},
    {
      message: 'Format email tidak valid',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password wajib diisi',
  })
  @MinLength(8, {
    message: 'Password minimal 8 karakter',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message:
      'Password harus kombinasi huruf dan angka',
  })
  password: string;

  @IsNotEmpty({
    message: 'Nama wajib diisi',
  })
  name: string;

  @IsNotEmpty({
    message: 'Username wajib diisi',
  })
  username: string;

  @IsNotEmpty({
    message: 'NIM wajib diisi',
  })
  nim: string;

  @IsNotEmpty({
    message: 'Jurusan wajib diisi',
  })
  jurusan_id: number;

  @IsNotEmpty({
    message: 'Program studi wajib diisi',
  })
  prodi_id: number;

  @IsNotEmpty({
    message: 'Konfirmasi password wajib diisi',
  })
  confirm_password: string;
}