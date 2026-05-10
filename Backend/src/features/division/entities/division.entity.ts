import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Event } from '../../event/entities/event.entity';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'divisions',
  modelName: 'divisions',
  indexes: [
    {
      unique: true,
      fields: ['event_id', 'name'],
    },
  ],
})
export class Division extends Model {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsTo(() => Event)
  declare event?: Event;

  @HasMany(
    () =>
      require('../../division-member/entities/division-member.entity')
        .DivisionMember,
    {
      foreignKey: 'division_id',
      as: 'members',
    },
  )
  members: any;
}
