export class CreateCertificateTemplateDto {
  name: string;
  event_id?: number;
}

export class UpdateCertificateTemplateDto {
  name?: string;
  is_default?: boolean;
}

export class SaveTemplateFieldsDto {
  fields: TemplateFieldDto[];
}

export class TemplateFieldDto {
  id?: number;
  field_type: string;
  label?: string;
  pos_x: number;
  pos_y: number;
  width?: number;
  height?: number;
  font_size?: number;
  font_family?: string;
  color?: string;
  rotation?: number;
  alignment?: string;
  z_index?: number;
}
