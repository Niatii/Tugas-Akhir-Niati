import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { Division } from "../../division/entities/division.entity";
import { Event } from "../../event/entities/event.entity";
import { getEventRegistrationStatusEnumLabel } from "../enums/event-registration-status.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "event_registrations",
  modelName: "event_registrations",
})
export class EventRegistration extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Division)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  division_id: number;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
    defaultValue: 0,
  })
  status: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getEventRegistrationStatusEnumLabel(this.getDataValue("status"));
    },
    set(value) {
      this.setDataValue(
        "status_name",
        getEventRegistrationStatusEnumLabel(this.getDataValue("status")),
      );
    },
  })
  status_name: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Division)
  division: Division;

  @BelongsTo(() => Event)
  event: Event;
}
