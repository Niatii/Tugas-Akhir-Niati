import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Jurusan } from './jurusan.model';
import { CreateJurusanDto } from './dto/create-jurusan.dto';

@Injectable()
export class JurusanService {
  constructor(
    @InjectModel(Jurusan)
    private jurusanModel: typeof Jurusan,
  ) {}

  async create(dto: CreateJurusanDto) {
    const exist = await this.jurusanModel.findOne({
      where: { name: dto.name },
    });

    if (exist) {
      throw new BadRequestException('Jurusan sudah ada');
    }

    return this.jurusanModel.create({
      name: dto.name,
    });
  }

  async findAll() {
    return this.jurusanModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number) {
    return this.jurusanModel.findByPk(id);
  }

  async delete(id: number) {
    return this.jurusanModel.destroy({
      where: { id },
    });
  }
}