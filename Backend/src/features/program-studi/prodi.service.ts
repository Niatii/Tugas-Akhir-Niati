import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Prodi } from './prodi.model';
import { Jurusan } from '../jurusan/jurusan.model';
import { CreateProdiDto } from './dto/create-prodi.dto';

@Injectable()
export class ProdiService {
  constructor(
    @InjectModel(Prodi)
    private prodiModel: typeof Prodi,

    @InjectModel(Jurusan)
    private jurusanModel: typeof Jurusan,
  ) {}

  async create(dto: CreateProdiDto) {
    // cek jurusan ada atau tidak
    const jurusan = await this.jurusanModel.findByPk(dto.jurusan_id);
    if (!jurusan) {
      throw new BadRequestException('Jurusan tidak ditemukan');
    }

    return this.prodiModel.create(dto);
  }

  async findAll() {
    return this.prodiModel.findAll({
      include: [{ model: Jurusan, attributes: ['id', 'name'] }],
    });
  }

  async findByJurusan(jurusan_id: number) {
    return this.prodiModel.findAll({
      where: { jurusan_id },
      order: [['name', 'ASC']],
    });
  }
}