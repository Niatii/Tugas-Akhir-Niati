import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Jurusan } from '../jurusan/jurusan.model';

// 🔥 1. DEFINE ATTRIBUTES
interface ProdiAttributes {
  id: number;
  jurusan_id: number;
  name: string;
}

// 🔥 2. DEFINE CREATION ATTRIBUTES
interface ProdiCreationAttributes
  extends Optional<ProdiAttributes, 'id'> {}

@Table({
  tableName: 'prodi',
})
export class Prodi extends Model<
  ProdiAttributes,
  ProdiCreationAttributes
> {
  @ForeignKey(() => Jurusan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  jurusan_id: number;

  @BelongsTo(() => Jurusan)
  jurusan: Jurusan;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}