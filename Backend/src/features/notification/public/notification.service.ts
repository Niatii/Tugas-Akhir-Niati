import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { User } from 'src/features/user/entities/user.entity';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private response: ResponseHelper,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async findAll(query: any, user: User) {
    const { count, data } = await new QueryBuilderHelper(
      this.notificationModel,
      query,
    )
      .where({ notified_user_id: user.id })
      .getResult();

    const result = {
      count: count,
      notifications: data,
    };

    return this.response.success(
      result,
      200,
      'Berhasil mengambil pemberitahuan',
    );
  }

  async markAllAsRead(user: User) {
    try {
      await this.notificationModel.update(
        { read_at: new Date() },
        {
          where: {
            notified_user_id: user.id,
          },
        },
      );

      return this.response.success(
        [],
        200,
        'Berhasil menandai semua pemberitahuan sebagai dibaca',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async markOneAsRead(id, user: User) {
    try {
      const notification = await this.notificationModel.findOne({
        where: {
          id: id,
          notified_user_id: user.id,
        },
      });

      await notification.update({ read_at: new Date() });

      return this.response.success(
        [],
        200,
        'Berhasil menandai pemberitahuan sebagai dibaca',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async deleteOne(id, user: User) {
    try {
      const notification = await this.notificationModel.findOne({
        where: {
          id: id,
          notified_user_id: user.id,
        },
      });

      if (notification) {
        await notification.destroy();
      }

      return this.response.success(
        [],
        200,
        'Berhasil menghapus pemberitahuan',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }
}
