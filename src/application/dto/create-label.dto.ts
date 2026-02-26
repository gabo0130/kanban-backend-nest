import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;
}
