import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  BelongsTo,
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
    exclude: ["password", "reset_token", "reset_token_expiry"],
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

  @ForeignKey(() => require('../../program-studi/prodi.model').Prodi)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  prodi_id: number;

  @BelongsTo(() => require('../../program-studi/prodi.model').Prodi)
  prodi: any;

  @ForeignKey(() => require('../../jurusan/jurusan.model').Jurusan)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  jurusan_id: number;

  @BelongsTo(() => require('../../jurusan/jurusan.model').Jurusan)
  jurusan: any;

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
    type: DataType.STRING,
    allowNull: true,
  })
  reset_token: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reset_token_expiry: Date;

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
