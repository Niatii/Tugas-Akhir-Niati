import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Meeting } from "../../meeting/entities/meeting.entity";
import { User } from "../../user/entities/user.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "attendances",
  modelName: "attendances",
})
export class Attendance extends Model {
  @ForeignKey(() => Meeting)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  meeting_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
    defaultValue: 0,
  })
  status: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  attended_at: Date;

  @BelongsTo(() => Meeting)
  meeting: Meeting;

  @BelongsTo(() => User)
  user: User;
}
