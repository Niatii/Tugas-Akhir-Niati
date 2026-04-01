import {
  Column,
  DataType,
  DefaultScope,
  Model,
  Table,
} from "sequelize-typescript";
import { getUserRoleEnumLabel } from "../enums/user-role.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "users",
  modelName: "users",
})
@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  study_program: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  major: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nim: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  batch_year: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
    defaultValue: 0,
  })
  role: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getUserRoleEnumLabel(this.getDataValue("role"));
    },
    set(value) {
      this.setDataValue(
        "role_name",
        getUserRoleEnumLabel(this.getDataValue("role")),
      );
    },
  })
  role_name: string;
}
