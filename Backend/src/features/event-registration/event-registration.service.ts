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
import { Notification } from '../notification/entities/notification.entity';

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectModel(DivisionMember)
    private readonly divisionMemberModel: typeof DivisionMember,
    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
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
              attributes: ['id', 'name', 'email', 'url'],
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

  async checkMyStatus(eventId: number, user: any) {
    try {
      const registration = await this.eventRegistrationModel.findOne({
        where: {
          user_id: user.id,
          event_id: eventId,
        },
        attributes: ['id', 'status', 'division_id', 'position', 'created_at'],
      });

      if (!registration) {
        return this.response.success(
          { registered: false, status: null },
          200,
          'Belum pernah mendaftar di acara ini',
        );
      }

      return this.response.success(
        {
          registered: true,
          status: registration.status,
          registration_id: registration.id,
        },
        200,
        'Status pendaftaran ditemukan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
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
              'batch_year',
              'phone_number',
              'url',
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

  async create(createEventRegistrationDto: CreateEventRegistrationDto, user: any) {
    const transaction = await this.sequelize.transaction();
    try {
      // Inject user_id dari JWT token
      const user_id = user.id;

      // Cek kelengkapan data profil user
      const fullUser = await User.findByPk(user_id, { transaction });
      if (!fullUser) {
        await transaction.rollback();
        return this.response.fail('User tidak ditemukan', 404);
      }

      if (
        !fullUser.name ||
        !fullUser.nim ||
        !fullUser.email ||
        !fullUser.phone_number ||
        !fullUser.batch_year ||
        !fullUser.jurusan_id ||
        !fullUser.prodi_id
      ) {
        await transaction.rollback();
        return this.response.fail(
          'Profil Anda belum lengkap. Silakan lengkapi profil Anda terlebih dahulu.',
          400,
        );
      }

      // Cek apakah user sudah pernah mendaftar di event yang sama
      const existing = await this.eventRegistrationModel.findOne({
        where: {
          user_id,
          event_id: createEventRegistrationDto.event_id,
        },
        transaction,
      });

      if (existing) {
        // Status REJECTED (2) → izinkan daftar ulang dengan hapus registrasi lama
        if (existing.status === 2) {
          await existing.destroy({ transaction });
        } else {
          // Status PENDING (0) atau APPROVED (1) → tidak boleh daftar ulang
          await transaction.rollback();
          const statusMsg = existing.status === 0
            ? 'Pendaftaran kamu sedang menunggu persetujuan'
            : 'Kamu sudah terdaftar dan diterima di acara ini';
          return this.response.fail(statusMsg, 400);
        }
      }

      const eventRegistration = await this.eventRegistrationModel.create(
        {
          ...createEventRegistrationDto,
          user_id,
          position: createEventRegistrationDto.position?.trim() || 'Anggota',
          status: 0, // pending
        } as any,
        { transaction },
      );
      await transaction.commit();
      // ─── Notif ke Admin: peserta baru menunggu verifikasi ───
      try {
        const event = await this.eventModel.findByPk(
          createEventRegistrationDto.event_id,
          { attributes: ['id', 'title', 'user_id'] },
        );
        if (event) {
          await this.notificationModel.create({
            type: 'registration_pending',
            notified_user_id: event.user_id,
            data: JSON.stringify({
              registration_id: eventRegistration.id,
              event_id: event.id,
            }),
            message: `Ada peserta baru yang mendaftar di acara "${event.title}" dan menunggu verifikasi.`,
          });
        }
      } catch (e) {
        console.error('[Notif] registration_pending error:', e?.message);
      }
      return this.response.success(
        { event_registration: eventRegistration },
        201,
        'Pendaftaran berhasil dikirim',
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

      // ─── Notif ke User: verifikasi diterima atau ditolak ───
      try {
        const reg = await this.eventRegistrationModel.findByPk(
          eventRegistration.id,
          {
            include: [
              { model: Event, attributes: ['id', 'title'] },
              { model: Division, attributes: ['id', 'name'] },
            ],
          },
        );
        if (reg && (updateEventRegistrationDto.status === 1 || updateEventRegistrationDto.status === 2)) {
          const isApproved = updateEventRegistrationDto.status === 1;
          await this.notificationModel.create({
            type: isApproved ? 'registration_approved' : 'registration_rejected',
            notified_user_id: eventRegistration.user_id,
            data: JSON.stringify({
              registration_id: eventRegistration.id,
              event_id: reg.event?.id,
            }),
            message: isApproved
              ? `Selamat! Pendaftaran kamu di acara "${reg.event?.title}" (Divisi ${reg.division?.name}) telah diterima.`
              : `Pendaftaran kamu di acara "${reg.event?.title}" (Divisi ${reg.division?.name}) tidak diterima.`,
          });
        }
      } catch (e) {
        console.error('[Notif] registration_status error:', e?.message);
      }

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
