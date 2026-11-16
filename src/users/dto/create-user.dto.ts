import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  photo?: string;
  @IsNumber()
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  @IsIn(['male', 'female', 'others'])
  gender: string;
}
