import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { S3Helper } from 'src/cores/helpers/s3.helper';
import { User } from '../user/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Division } from '../division/entities/division.entity';
import { getEventStatusEnumLabel } from './enums/event-status.enum';
import { DivisionMember } from '../division-member/entities/division-member.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(Division)
    private readonly divisionModel: typeof Division,

    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  private getDynamicStatus(event: Event): number {
    const now = new Date();

    if (event.status === 0) return 0; // draft tetap

    if (now < new Date(event.registration_start)) return 1;
    if (now <= new Date(event.registration_end)) return 2;
    if (now < new Date(event.start_date)) return 3;
    if (now <= new Date(event.end_date)) return 4;

    return 5;
  }

  private isFieldChanged(oldValue: any, newValue: any) {
    if (!newValue) return false;
    return new Date(oldValue).getTime() !== new Date(newValue).getTime();
  }

  async findAll(query: any) {
    try {
      const condition = {};

      const { count, data } = await new QueryBuilderHelper(
        this.eventModel,
        query,
      )
        .where(condition)
        .options({
          include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        })
        .getResult();

      const events = data.map((event) => {
        const dynamicStatus = this.getDynamicStatus(event);

        return {
          ...event,
          status: dynamicStatus,
          status_name: getEventStatusEnumLabel(dynamicStatus),
        };
      });
      const result = {
        count: count,
        events: events,
      };
      return this.response.success(result, 200, 'Successfully get events');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(event: Event) {
    try {
      const data = await this.eventModel.findByPk(event.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Division,
            include: [
              {
                model: DivisionMember,
                as: 'members',
                include: [
                  {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                  },
                ],
              },
            ],
          },
        ],
      });

      const dynamicStatus = this.getDynamicStatus(data);

      const event_members = data.divisions.flatMap((d) =>
        d.members.map((m) => ({
          id: m.id,
          user_id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          division: d.name,
          position: m.position,
        })),
      );

      return this.response.success(
        {
          ...data.toJSON(),
          status: dynamicStatus,
          status_name: getEventStatusEnumLabel(dynamicStatus),

          event_members,
        },
        200,
        'Successfully get event',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createEventDto: CreateEventDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const event = await this.eventModel.create(
        { ...createEventDto },
        { transaction },
      );
      if (createEventDto.divisis?.length) {
        const divisions = createEventDto.divisis.map((d) => ({
          name: d.name,
          event_id: event.id,
        }));

        await this.divisionModel.bulkCreate(divisions, { transaction });
      }
      await transaction.commit();
      return this.response.success(
        { event },
        201,
        'Successfully created event',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(event: Event, updateEventDto: UpdateEventDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const status = this.getDynamicStatus(event);

      const { registration_start, registration_end, start_date, divisis } =
        updateEventDto;

      if (status === 2) {
        if (this.isFieldChanged(event.registration_start, registration_start)) {
          throw new Error('Tidak bisa mengubah tanggal pendaftaran dibuka');
        }
      }

      if (status === 3) {
        if (
          this.isFieldChanged(event.registration_start, registration_start) ||
          this.isFieldChanged(event.registration_end, registration_end)
        ) {
          throw new Error('Tidak bisa mengubah tanggal pendaftaran');
        }
      }

      if (status === 4) {
        if (
          this.isFieldChanged(event.registration_start, registration_start) ||
          this.isFieldChanged(event.registration_end, registration_end) ||
          this.isFieldChanged(event.start_date, start_date)
        ) {
          throw new Error('Tidak bisa mengubah tanggal saat event berlangsung');
        }

        if (divisis?.length) {
          throw new Error(
            'Tidak bisa menambah atau menghapus divisi saat event berlangsung',
          );
        }
      }

      if (divisis) {
        const existingDivisions = await this.divisionModel.findAll({
          where: { event_id: event.id },
          include: ['members'], // pastikan relasi ada
        });

        for (const oldDiv of existingDivisions) {
          const stillExists = divisis.find((d) => d.name === oldDiv.name);

          if (!stillExists && oldDiv.members?.length > 0) {
            throw new Error(
              `Divisi ${oldDiv.name} tidak bisa dihapus karena sudah memiliki anggota`,
            );
          }
        }
      }

      delete updateEventDto.user_id;
      delete updateEventDto.status;
      await event.update(updateEventDto, { transaction });

      if (divisis) {
        await this.divisionModel.destroy({
          where: { event_id: event.id },
          transaction,
        });

        const newDivs = divisis.map((d) => ({
          name: d.name,
          event_id: event.id,
        }));

        await this.divisionModel.bulkCreate(newDivs, { transaction });
      }
      await transaction.commit();
      return this.response.success(
        { event },
        200,
        'Successfully updated event',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async uploadImage(event: Event, file: Express.Multer.File) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (event.image_file) {
        await s3Helper.deleteFile(event.image_file);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          'events/images',
          'public-read',
        );

        const imageUrl = new URL(uploadResult.Location);

        await event.update(
          {
            image_file: imageUrl.pathname.substring(1),
            image_url: imageUrl.href,
          },
          { transaction },
        );
      } else {
        await event.update(
          {
            image_file: null,
            image_url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        event,
        200,
        'Successfully update event image',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(event: Event) {
    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (event.image_file) {
        await s3Helper.deleteFile(event.image_file);
      }

      await event.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Successfully deleted event');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
