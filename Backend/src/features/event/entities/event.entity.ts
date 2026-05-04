import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { getEventStatusEnumLabel } from '../enums/event-status.enum';
import { HasMany } from 'sequelize-typescript';
import { Division } from '../../division/entities/division.entity';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'events',
  modelName: 'events',
})
export class Event extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_file: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  registration_start: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  registration_end: Date;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
    defaultValue: 0,
  })
  status: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getEventStatusEnumLabel(this.getDataValue('status'));
    },
    set(value) {
      this.setDataValue(
        'status_name',
        getEventStatusEnumLabel(this.getDataValue('status')),
      );
    },
  })
  status_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  benefit: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  requirement: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description_divisi: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Division)
  divisions: Division[];
}
