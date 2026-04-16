import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "certificates",
  modelName: "certificates",
})
export class Certificate extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_url: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  issued_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Event)
  event: Event;
}
