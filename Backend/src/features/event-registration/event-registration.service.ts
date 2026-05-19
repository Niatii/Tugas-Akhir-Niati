import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Division } from '../division/entities/division.entity';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';
import { Jurusan } from '../jurusan/jurusan.model';
import { Prodi } from '../program-studi/prodi.model';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { EventRegistration } from './entities/event-registration.entity';
import { DivisionMember } from '../division-member/entities/division-member.entity';

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectModel(DivisionMember)
    private readonly divisionMemberModel: typeof DivisionMember,
    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,
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
      const filteredQuery = { ...query };

      delete filteredQuery.event_id;

      const { count, data } = await new QueryBuilderHelper(
        this.eventRegistrationModel,
        filteredQuery,
      )
        .options({
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email'],
            },
            {
              model: Division,
              attributes: ['id', 'name'],
            },
            {
              model: Event,
              attributes: ['id', 'title'],
              where: {
                user_id: user.id,
                ...(query.event_id && {
                  id: query.event_id,
                }),
              },
            },
          ],
        })
        .getResult();

      return this.response.success(
        {
          count,
          event_registrations: data,
        },
        200,
        'Successfully get event registrations',
      );
    } catch (error) {
      return this.response.fail(error.message, 400);
    }
  }

  async findOne(id: number, user: any) {
    try {
      const data = await this.eventRegistrationModel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: User,
            attributes: [
              'id',
              'name',
              'email',
              'nim',
              'jurusan_id',
              'prodi_id',
            ],
            include: [
              {
                model: Jurusan,
                attributes: ['id', 'name'],
              },
              {
                model: Prodi,
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: Division,
            attributes: ['id', 'name'],
          },
          {
            model: Event,
            attributes: [
              'id',
              'title',
              'user_id',
              'status',
              'registration_start',
              'registration_end',
              'start_date',
              'end_date',
            ],
          },
        ],
      });

      if (!data) {
        return this.response.fail('Event registration not found', 404);
      }

      // dynamic event status
      const dynamicStatus = this.getDynamicStatus(data.event);

      data.event.status = dynamicStatus;

      const isRegistrant = data.user_id === user.id;

      const isEventOwner = data.event?.user_id === user.id;

      if (!isRegistrant && !isEventOwner) {
        return this.response.fail('Forbidden access', 403);
      }

      return this.response.success(
        {
          event_registration: data,
        },
        200,
        'Successfully get event registration',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const eventRegistration = await this.eventRegistrationModel.create(
        { ...createEventRegistrationDto } as any,
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { event_registration: eventRegistration },
        201,
        'Successfully created event registration',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    eventRegistration: EventRegistration,
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      await eventRegistration.update(updateEventRegistrationDto, {
        transaction,
      });

      // jika approve
      if (updateEventRegistrationDto.status === 1) {
        // cek apakah sudah jadi member
        const existingMember = await this.divisionMemberModel.findOne({
          where: {
            user_id: eventRegistration.user_id,
            division_id: eventRegistration.division_id,
          },
          transaction,
        });

        // jika belum ada → create member
        if (!existingMember) {
          await this.divisionMemberModel.create(
            {
              user_id: eventRegistration.user_id,

              division_id: eventRegistration.division_id,

              position: updateEventRegistrationDto.position || 'Anggota',
            },
            { transaction },
          );
        } else {
          await existingMember.update(
            {
              position:
                updateEventRegistrationDto.position || existingMember.position,
            },
            { transaction },
          );
        }
      }

      await transaction.commit();

      return this.response.success(
        { event_registration: eventRegistration },
        200,
        'Successfully updated event registration',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(eventRegistration: EventRegistration) {
    const transaction = await this.sequelize.transaction();
    try {
      await eventRegistration.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        'Successfully deleted event registration',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
