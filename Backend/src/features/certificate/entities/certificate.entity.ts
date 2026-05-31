import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Event } from '../../event/entities/event.entity';
import { CertificateTemplate } from './certificate-template.entity';

export enum CertificateStatus {
  DRAFT = 0,
  GENERATED = 1,
  PUBLISHED = 2,
}

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'certificates',
  modelName: 'certificates',
})
export class Certificate extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  certificate_number: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  attendance_percentage: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_url: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  issued_at: Date;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: CertificateStatus.DRAFT,
  })
  status: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_manual: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  published_at: Date;

  @ForeignKey(() => CertificateTemplate)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  template_id: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const s = this.getDataValue('status');
      if (s === CertificateStatus.PUBLISHED) return 'Published';
      if (s === CertificateStatus.GENERATED) return 'Generated';
      return 'Draft';
    },
  })
  status_name: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Event)
  event: Event;

  @BelongsTo(() => CertificateTemplate)
  template: CertificateTemplate;
}
