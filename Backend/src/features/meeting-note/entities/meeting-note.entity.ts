import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Meeting } from '../../meeting/entities/meeting.entity';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'meeting_notes',
  modelName: 'meeting_notes',
})
export class MeetingNote extends Model {
  @ForeignKey(() => require('../../meeting/entities/meeting.entity').Meeting)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  meeting_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  created_by: number;

  @BelongsTo(() => require('../../meeting/entities/meeting.entity').Meeting)
  meeting: any;
}
