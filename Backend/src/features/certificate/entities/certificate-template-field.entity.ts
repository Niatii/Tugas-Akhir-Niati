import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import type { CertificateTemplate } from './certificate-template.entity';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'certificate_template_fields',
  modelName: 'certificate_template_fields',
})
export class CertificateTemplateField extends Model {
  @ForeignKey(
    () => require('./certificate-template.entity').CertificateTemplate,
  )
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  template_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  field_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  label: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  pos_x: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  pos_y: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  width: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  height: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 16,
  })
  font_size: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Arial',
  })
  font_family: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '#000000',
  })
  color: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  rotation: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'left',
  })
  alignment: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  z_index: number;

  @BelongsTo(
    () => require('./certificate-template.entity').CertificateTemplate,
  )
  template: CertificateTemplate;
}