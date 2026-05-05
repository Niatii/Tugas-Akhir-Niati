import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Event } from '../event/entities/event.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from './entities/division.entity';

@Injectable()
export class DivisionService {
  constructor(
    @InjectModel(Division)
    private readonly divisionModel: typeof Division,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.divisionModel,
        query,
      )
        .where(condition)
        .options({
          include: [{ model: Event, attributes: ['id', 'title'] }],
        })
        .getResult();

      const result = {
        count: count,
        divisions: data,
      };
      return this.response.success(result, 200, 'Successfully get divisions');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(division: Division) {
    try {
      const result = await this.divisionModel.findOne({
        where: { id: division.id },
        include: [
          {
            model: Event,
            attributes: ['id', 'title'],
          },
        ],
      });

      return this.response.success(result, 200, 'Successfully get division');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createDivisionDto: CreateDivisionDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const division = await this.divisionModel.create(
        { ...createDivisionDto },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { division },
        201,
        'Successfully created division',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(division: Division, updateDivisionDto: UpdateDivisionDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await division.update(updateDivisionDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { division },
        200,
        'Successfully updated division',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(division: Division) {
    const transaction = await this.sequelize.transaction();
    try {
      await division.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Successfully deleted division');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
