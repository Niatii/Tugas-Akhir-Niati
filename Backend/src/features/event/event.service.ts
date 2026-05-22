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
import EventStatusEnum, {
  getEventStatusEnumLabel,
} from './enums/event-status.enum';
import { DivisionMember } from '../division-member/entities/division-member.entity';
import { getEventRegistrationStatusEnumLabel } from '../event-registration/enums/event-registration-status.enum';
import { EventRegistration } from '../event-registration/entities/event-registration.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { Attendance } from '../attendace/entities/attendace.entity';
import { MeetingNote } from '../meeting-note/entities/meeting-note.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,

    @InjectModel(Division)
    private readonly divisionModel: typeof Division,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  // private getDynamicStatus(event: Event): number {
  //   const now = new Date();
  //   if (event.status === 0) return 0; // draft tetap
  //   if (now < new Date(event.registration_start)) return 1;
  //   if (now <= new Date(event.registration_end)) return 2;
  //   if (now < new Date(event.start_date)) return 3;
  //   if (now <= new Date(event.end_date)) return 4;
  //   return 5;
  // }

  private isFieldChanged(oldValue: any, newValue: any) {
    if (!newValue) return false;
    return new Date(oldValue).getTime() !== new Date(newValue).getTime();
  }

  async findLandingEvents() {
    try {
      const events = await this.eventModel.findAll({
        where: {
          status: EventStatusEnum.REGISTRATION_OPEN,
        },

        attributes: [
          'id',
          'title',
          'image_url',
          'start_date',
          'end_date',
          'registration_start',
          'registration_end',
          'status',
          'description',
          'created_at',
        ],

        include: [
          {
            model: User,
            attributes: ['id', 'name'],
          },
        ],

        order: [['created_at', 'DESC']],

        limit: 3,
      });

      const result = events.map((event) => ({
        ...event.toJSON(),

        status_name: getEventStatusEnumLabel(event.status),
      }));

      return this.response.success(
        {
          count: result.length,
          events: result,
        },
        200,
        'Berhasil menampilkan acara landing page',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findPublicEvents(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.eventModel,
        query,
      )
        .where({
          status: 2, // REGISTRATION_OPEN
        })
        .options({
          attributes: [
            'id',
            'title',
            'image_url',
            'start_date',
            'end_date',
            'registration_start',
            'registration_end',
            'status',
            'created_at',
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
          order: [['created_at', 'DESC']],
        })
        .getResult();

      const events = data.map((event) => ({
        ...event,
        status_name: getEventStatusEnumLabel(event.status),
      }));

      return this.response.success(
        {
          count,
          events,
        },
        200,
        'Daftar acara berhasil ditampilkan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findPublicOne(event: Event) {
    try {
      const data = await this.eventModel.findByPk(event.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name'],
          },
          {
            model: Division,
            attributes: ['id', 'name'],
          },
        ],
      });

      return this.response.success(
        {
          ...data.toJSON(),

          status_name: getEventStatusEnumLabel(data.status),
        },
        200,
        'Detail acara berhasil ditampilkan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findMyEvents(user: any) {
    try {
      const registrations = await this.eventRegistrationModel.findAll({
        where: {
          user_id: user.id,
        },

        include: [
          {
            model: Division,
            attributes: ['id', 'name'],

            include: [
              {
                model: Event,

                include: [
                  {
                    model: User,

                    attributes: ['id', 'name'],
                  },
                ],
              },
            ],
          },
        ],
      });

      const events = registrations.map((reg) => ({
        id: reg.id,

        /**
         * STATUS REGISTRASI
         */
        registration_status: reg.status,

        registration_status_name: getEventRegistrationStatusEnumLabel(
          reg.status,
        ),

        /**
         * POSITION
         */
        position: reg.position,

        /**
         * DIVISION
         */
        division: {
          id: reg.division.id,

          name: reg.division.name,
        },

        /**
         * EVENT
         */
        event: {
          id: reg.division.event.id,

          title: reg.division.event.title,

          image_url: reg.division.event.image_url,

          start_date: reg.division.event.start_date,

          end_date: reg.division.event.end_date,

          status: reg.division.event.status,

          status_name: getEventStatusEnumLabel(reg.division.event.status),

          user: reg.division.event.user,
        },
      }));

      return this.response.success(
        {
          count: events.length,

          events,
        },
        200,

        'Acara saya berhasil ditampilkan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findMyEventDetail(registrationId: number, user: any) {
    try {
      const registration = await this.eventRegistrationModel.findOne({
        where: {
          id: registrationId,

          user_id: user.id,
        },

        include: [
          {
            model: Division,

            attributes: ['id', 'name'],

            include: [
              {
                model: Event,

                include: [
                  {
                    model: User,

                    attributes: ['id', 'name'],
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

                  {
                    model: Meeting,
                    include: [
                      { model: MeetingNote, required: false },
                      {
                        model: Attendance,
                        required: false,
                        include: [{ model: User, attributes: ['id', 'name'] }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!registration) {
        throw new Error('Acara tidak ditemukan');
      }

      const event = registration.division.event;

      const isCoordinator =
        registration.position?.toLowerCase() === 'koordinator';

      /**
       * FORMAT MEETINGS
       */
      const meetings = (event.meetings || [])
        /**
         * Coordinator:
         * hanya lihat rapat divisi sendiri
         */
        .filter((meeting) => {
          if (isCoordinator) {
            return (
              meeting.division_id === null ||
              meeting.division_id === registration.division.id
            );
          }

          return true;
        })
        .map((meeting) => {
          /**
           * FILTER ATTENDANCE
           */
          const attendances = (meeting.attendances || []).filter(
            (attendance) => {
              /**
               * Coordinator:
               * lihat semua attendance
               */
              if (isCoordinator) {
                return true;
              }

              /**
               * Anggota:
               * hanya attendance miliknya
               */
              return attendance.user_id === user.id;
            },
          );

          return {
            id: meeting.id,

            title: meeting.title,

            division_id: meeting.division_id,

            location: meeting.location,

            schedule_date: meeting.schedule_date,

            started_at: meeting.started_at,

            ended_at: meeting.ended_at,

            status: meeting.status,

            status_name: meeting.status_name,

            meeting_type: meeting.meeting_type,

            meeting_type_name: meeting.meeting_type_name,

            notulen: meeting.meeting_note?.content || '',

            attendances: attendances.map((attendance) => ({
              id: attendance.id,

              user_id: attendance.user_id,

              user_name: attendance.user?.name,

              status: attendance.status,
            })),
          };
        });

      return this.response.success(
        {
          id: registration.id,

          registration_status: registration.status,

          registration_status_name: getEventRegistrationStatusEnumLabel(
            registration.status,
          ),

          position: registration.position,

          division: {
            id: registration.division.id,

            name: registration.division.name,
          },

          event: {
            id: event.id,

            title: event.title,

            description: event.description,

            benefit: event.benefit,

            requirement: event.requirement,

            description_divisi: event.description_divisi,

            image_url: event.image_url,

            start_date: event.start_date,

            end_date: event.end_date,

            status: event.status,

            status_name: getEventStatusEnumLabel(event.status),

            user: event.user,

            divisions: event.divisions,

            meetings,
          },
        },

        200,

        'Detail acara berhasil ditampilkan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findAll(query: any, user: any) {
    try {
      const condition = {
        user_id: user.id,
      };

      const { count, data } = await new QueryBuilderHelper(
        this.eventModel,
        query,
      )
        .where(condition)
        .options({
          attributes: [
            'id',
            'title',
            'image_url',
            'start_date',
            'end_date',
            'registration_start',
            'registration_end',
            'status',
            'created_at',
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
        })
        .getResult();

      const events = data.map((event) => {
        // const dynamicStatus = this.getDynamicStatus(event);

        return {
          ...event,
          status: event.status,
          status_name: getEventStatusEnumLabel(event.status),
        };
      });
      const result = {
        count: count,
        events: events,
      };
      return this.response.success(result, 200, 'Acara berhasil ditampilkan');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(event: Event, user: any) {
    try {
      if (event.user_id !== user.id) {
        throw new Error('Anda tidak memiliki akses');
      }

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

          status: data.status,

          status_name: getEventStatusEnumLabel(data.status),

          event_members,
        },
        200,
        'Acara berhasil ditampilkan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createEventDto: CreateEventDto, user: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const registrationStart = new Date(createEventDto.registration_start);

      registrationStart.setHours(0, 0, 0, 0);

      if (registrationStart < today) {
        return this.response.fail(
          'Tanggal pendaftaran dibuka tidak boleh sebelum hari ini',
          400,
        );
      }
      const event = await this.eventModel.create(
        { ...createEventDto, user_id: user.id },
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
      return this.response.success({ event }, 201, 'Acara berhasil dibuat');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async publish(event: Event, user: any) {
    const transaction = await this.sequelize.transaction();

    try {
      if (event.user_id !== user.id) {
        throw new Error('Anda tidak memiliki akses');
      }

      if (
        !event.title ||
        !event.description ||
        !event.benefit ||
        !event.requirement ||
        !event.description_divisi ||
        !event.registration_start ||
        !event.registration_end ||
        !event.start_date ||
        !event.end_date
      ) {
        throw new Error('Semua data wajib acara harus diisi sebelum publish');
      }

      const divisions = await this.divisionModel.findAll({
        where: {
          event_id: event.id,
        },
        transaction,
      });

      if (!divisions.length) {
        throw new Error('Minimal harus memiliki 1 divisi');
      }

      const hasEmptyDivision = divisions.some((d) => !d.name?.trim());

      if (hasEmptyDivision) {
        throw new Error('Masih ada nama divisi yang kosong');
      }

      await event.update(
        {
          status: 1,
        },
        { transaction },
      );

      await transaction.commit();

      return this.response.success({ event }, 200, 'Acara berhasil dipublish');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(event: Event, updateEventDto: UpdateEventDto, user: any) {
    const transaction = await this.sequelize.transaction();
    try {
      if (event.user_id !== user.id) {
        throw new Error('Anda tidak memiliki akses untuk mengubah Acara ini');
      }
      const status = event.status;

      const { registration_start, registration_end, start_date, divisis } =
        updateEventDto;
      if (registration_start) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const registrationStartDate = new Date(registration_start);

        registrationStartDate.setHours(0, 0, 0, 0);

        if (registrationStartDate < today) {
          throw new Error(
            'Tanggal pendaftaran dibuka tidak boleh sebelum hari ini',
          );
        }
      }

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
          include: ['members'],
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

      if ('user_id' in updateEventDto) {
        delete (updateEventDto as any).user_id;
      }
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
      return this.response.success({ event }, 200, 'Acara berhasil diperbarui');
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
        'Gambar acara berhasil diperbarui',
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
      return this.response.success({}, 200, 'Acara berhasil dihapus');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
