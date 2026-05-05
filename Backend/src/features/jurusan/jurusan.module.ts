import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Jurusan } from './jurusan.model';
import { JurusanService } from './jurusan.service';
import { JurusanController } from './jurusan.controller';

@Module({
  imports: [SequelizeModule.forFeature([Jurusan])],
  providers: [JurusanService],
  controllers: [JurusanController],
  exports: [JurusanService],
})
export class JurusanModule {}