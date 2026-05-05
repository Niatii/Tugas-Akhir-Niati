import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Prodi } from './prodi.model';
import { ProdiService } from './prodi.service';
import { ProdiController } from './prodi.controller';
import { Jurusan } from '../jurusan/jurusan.model'; 

@Module({
  imports: [SequelizeModule.forFeature([Prodi, Jurusan])],
  providers: [ProdiService],
  controllers: [ProdiController],
})
export class ProdiModule {}