import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Division } from "../../division/entities/division.entity";
import { Event } from "../../event/entities/event.entity";
import { getMeetingStatusEnumLabel } from "../enums/meeting-status.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "meetings",
  modelName: "meetings",
})
export class Meeting extends Model {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @ForeignKey(() => Division)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  division_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

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
  date: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  updated_by: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  schedule_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  meeting_type: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getMeetingStatusEnumLabel(this.getDataValue("status"));
    },
    set(value) {
      this.setDataValue(
        "status_name",
        getMeetingStatusEnumLabel(this.getDataValue("status")),
      );
    },
  })
  status_name: string;

  @BelongsTo(() => Event)
  event: Event;

  @BelongsTo(() => Division)
  division: Division;
}
