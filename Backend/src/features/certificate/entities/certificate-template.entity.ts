import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Event } from '../../event/entities/event.entity';
import { CertificateTemplateField } from './certificate-template-field.entity';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'certificate_templates',
  modelName: 'certificate_templates',
})
export class CertificateTemplate extends Model {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  background_file: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  background_url: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_default: boolean;

  @BelongsTo(() => Event)
  event: Event;

  @HasMany(() => CertificateTemplateField)
  fields: CertificateTemplateField[];
}
