import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}
