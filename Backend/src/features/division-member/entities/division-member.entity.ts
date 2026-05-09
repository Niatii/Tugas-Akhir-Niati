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

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "division_members",
  modelName: "division_members",
})
export class DivisionMember extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  position: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
    defaultValue: 2,
  })
  role: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return require('../enums/division-member-role.enum').getDivisionMemberRoleEnumLabel(
        this.getDataValue("role")
      );
    },
    set(value) {
      this.setDataValue(
        "role_name",
        require('../enums/division-member-role.enum').getDivisionMemberRoleEnumLabel(
          this.getDataValue("role")
        )
      );
    },
  })
  role_name: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Division)
  division: Division;
}
