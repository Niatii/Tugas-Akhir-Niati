import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Division } from "./entities/division.entity";
import { DivisionController } from "./division.controller";
import { DivisionService } from "./division.service";

@Module({
  imports: [SequelizeModule.forFeature([Division])],
  controllers: [DivisionController],
  providers: [DivisionService],
})
export class DivisionModule {}
