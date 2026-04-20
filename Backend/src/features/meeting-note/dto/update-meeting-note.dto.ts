import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingNoteDto } from './create-meeting-note.dto';

export class UpdateMeetingNoteDto extends PartialType(CreateMeetingNoteDto) {}
