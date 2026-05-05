import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'jurusan',
})
export class Jurusan extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;
}