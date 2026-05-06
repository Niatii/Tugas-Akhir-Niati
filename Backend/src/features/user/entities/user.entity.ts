import {
  Column,
  DataType,
  DefaultScope,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'users',
  modelName: 'users',
})
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  jurusan_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  prodi_id: number;

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

}
