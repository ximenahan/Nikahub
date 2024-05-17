import { PartialType } from '@nestjs/mapped-types';
import { CreateFirstentityDto } from './create-firstentity.dto';

export class UpdateFirstentityDto extends PartialType(CreateFirstentityDto) {}
