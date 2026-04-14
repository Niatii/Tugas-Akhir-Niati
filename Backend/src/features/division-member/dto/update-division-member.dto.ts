import { PartialType } from '@nestjs/mapped-types';
import { CreateDivisionMemberDto } from './create-division-member.dto';

export class UpdateDivisionMemberDto extends PartialType(CreateDivisionMemberDto) {}
