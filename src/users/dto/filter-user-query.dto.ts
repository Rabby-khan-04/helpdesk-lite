import { IsIn, IsOptional } from 'class-validator';

export class FilterUserQueryDto {
  @IsOptional()
  @IsIn(['male', 'female', 'others'])
  gender?: 'male' | 'female' | 'others';
}
