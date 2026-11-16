import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  photo?: string;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  age: number;
  @IsOptional()
  @IsNotEmpty()
  @IsIn(['male', 'female', 'others'])
  gender: string;
}

export class updateEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  oldEmail: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}
