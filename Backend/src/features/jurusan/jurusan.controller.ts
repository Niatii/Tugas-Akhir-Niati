import { Controller, Post, Body, Get, Param, Delete, HttpCode,
  HttpStatus,
  ParseIntPipe, } from '@nestjs/common';
import { JurusanService } from './jurusan.service';
import { CreateJurusanDto } from './dto/create-jurusan.dto';

@Controller('jurusan')
export class JurusanController {
  constructor(private readonly jurusanService: JurusanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateJurusanDto) {
    const data = await this.jurusanService.create(dto);

    return {
      success: true,
      message: 'Jurusan berhasil ditambahkan',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.jurusanService.findAll();

    return {
      success: true,
      message: 'Berhasil mengambil data jurusan',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.jurusanService.findOne(id);

    return {
      success: true,
      message: 'Berhasil mengambil detail jurusan',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.jurusanService.delete(id);

    return {
      success: true,
      message: 'Jurusan berhasil dihapus',
    };
  }
}