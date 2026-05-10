import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from './entities/division.entity';
import { DivisionMember } from '../division-member/entities/division-member.entity';
import { Op } from 'sequelize';

@Injectable()
export class DivisionService {
  constructor(
    @InjectModel(Division)
    private readonly divisionModel: typeof Division,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  private getDynamicStatus(event: Event): number {
    const now = new Date();

    if (event.status === 0) return 0;

    if (now < new Date(event.registration_start)) return 1;
    if (now <= new Date(event.registration_end)) return 2;
    if (now < new Date(event.start_date)) return 3;
    if (now <= new Date(event.end_date)) return 4;

    return 5;
  }

  async findAll(query: any, user: any) {
    try {
      const condition = {
        user_id: user.id,
      };

      const { count, data } = await new QueryBuilderHelper(
        this.divisionModel,
        query,
      )
        .options({
          include: [
            {
              model: Event,
              attributes: ['id', 'title', 'status'],
              where: {
                user_id: user.id,
                status: {
                  [Op.ne]: 0,
                },
              },
            },
            {
              model: DivisionMember,
              include: [
                {
                  model: User,
                  attributes: ['id', 'name', 'email'],
                },
              ],
            },
          ],
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

  async findOne(division: Division, user: any) {
    try {
      const result = await this.divisionModel.findOne({
        where: {
          id: division.id,
        },
        include: [
          {
            model: Event,
            attributes: ['id', 'title'],
            where: {
              user_id: user.id,
            },
          },
          {
            model: DivisionMember,
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'nim'],
              },
            ],
          },
        ],
      });

      return this.response.success(result, 200, 'Successfully get division');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createDivisionDto: CreateDivisionDto, user: any) {
    const transaction = await this.sequelize.transaction();

    try {
      const event = await Event.findOne({
        where: {
          id: createDivisionDto.event_id,
          user_id: user.id,
        },
        transaction,
      });

      if (!event) {
        throw new BadRequestException('Event tidak ditemukan');
      }

      const eventStatus = this.getDynamicStatus(event);

      // EVENT ONGOING
      if (eventStatus === 4) {
        throw new BadRequestException(
          'Tidak dapat menambah divisi saat acara sedang berlangsung',
        );
      }

      // EVENT COMPLETED
      if (eventStatus === 5) {
        throw new BadRequestException(
          'Tidak dapat menambah divisi karena acara telah selesai',
        );
      }

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

  async update(
    division: Division,
    updateDivisionDto: UpdateDivisionDto,
    user: any,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const event = await Event.findOne({
        where: {
          id: division.event_id,
          user_id: user.id,
        },
        transaction,
      });

      if (!event) {
        throw new BadRequestException('Division tidak ditemukan');
      }

      const eventStatus = this.getDynamicStatus(event);

      // EVENT COMPLETED
      if (eventStatus === 5) {
        throw new BadRequestException(
          'Divisi tidak dapat diedit karena acara telah selesai',
        );
      }

      // EVENT ONGOING
      if (eventStatus === 4) {
        if (updateDivisionDto.name || updateDivisionDto.event_id) {
          throw new BadRequestException(
            'Divisi tidak dapat diubah saat acara sedang berlangsung',
          );
        }
      }

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

  async remove(division: Division, user: any) {
    const transaction = await this.sequelize.transaction();

    try {
      const event = await Event.findOne({
        where: {
          id: division.event_id,
          user_id: user.id,
        },
        transaction,
      });

      if (!event) {
        throw new BadRequestException('Division tidak ditemukan');
      }

      const eventStatus = this.getDynamicStatus(event);

      // EVENT COMPLETED
      if (eventStatus === 5) {
        throw new BadRequestException(
          'Divisi tidak dapat dihapus karena acara telah selesai',
        );
      }

      // CEK MEMBER
      const memberCount = await DivisionMember.count({
        where: {
          division_id: division.id,
        },
        transaction,
      });

      if (memberCount > 0) {
        throw new BadRequestException(
          'Divisi tidak dapat dihapus karena sudah memiliki anggota',
        );
      }

      await division.destroy({ transaction });

      await transaction.commit();

      return this.response.success({}, 200, 'Successfully deleted division');
    } catch (error) {
      await transaction.rollback();

      return this.response.fail(error, 400);
    }
  }
}
