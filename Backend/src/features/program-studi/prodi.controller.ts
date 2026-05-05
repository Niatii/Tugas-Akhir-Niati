import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProdiService } from './prodi.service';
import { CreateProdiDto } from './dto/create-prodi.dto';

@Controller('prodi')
export class ProdiController {
  constructor(private readonly prodiService: ProdiService) {}

  @Post()
  async create(@Body() dto: CreateProdiDto) {
    const data = await this.prodiService.create(dto);

    return {
      success: true,
      message: 'Prodi berhasil ditambahkan',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.prodiService.findAll();

    return {
      success: true,
      data,
    };
  }


  @Get('jurusan/:jurusan_id')
  async findByJurusan(
    @Param('jurusan_id', ParseIntPipe) jurusan_id: number,
  ) {
    const data = await this.prodiService.findByJurusan(jurusan_id);

    return {
      success: true,
      data,
    };
  }
}