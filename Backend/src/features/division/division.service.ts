import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Event } from '../event/entities/event.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from './entities/division.entity';
import { Op } from 'sequelize';

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
      const existingDivision = await this.divisionModel.findOne({
        where: {
          name: createDivisionDto.name,
          event_id: createDivisionDto.event_id,
        },
        transaction,
      });

      if (existingDivision) {
        throw new BadRequestException(
          'Nama divisi sudah digunakan pada acara ini',
        );
      }

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
      const existingDivision = await this.divisionModel.findOne({
        where: {
          event_id: updateDivisionDto.event_id ?? division.event_id,

          name: updateDivisionDto.name ?? division.name,

          id: {
            [Op.ne]: division.id,
          },
        },
        transaction,
      });

      if (existingDivision) {
        throw new BadRequestException(
          'Nama divisi sudah digunakan pada acara ini',
        );
      }

      await division.update(updateDivisionDto, {
        transaction,
      });

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
