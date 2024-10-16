import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ListType } from '../../../../constants';
import { ApiProperty } from '@nestjs/swagger';
export class TodosDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  readonly body: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly completed: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly public: boolean = false;

  @ApiProperty({ enum: ListType })
  @IsNotEmpty()
  @IsEnum(ListType)
  readonly listType: string;
}
