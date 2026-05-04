import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Division } from "./entities/division.entity";
import { DivisionController } from "./division.controller";
import { DivisionService } from "./division.service";
import { DivisionMember } from "../division-member/entities/division-member.entity";

@Module({
  imports: [SequelizeModule.forFeature([Division, DivisionMember])],
  controllers: [DivisionController],
  providers: [DivisionService],
})
export class DivisionModule {}
