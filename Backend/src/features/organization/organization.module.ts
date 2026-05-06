import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from './organization.model';

@Module({
  imports: [SequelizeModule.forFeature([Organization])],
  exports: [SequelizeModule],
})
export class OrganizationModule {}