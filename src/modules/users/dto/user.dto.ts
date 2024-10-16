import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  Matches
} from 'class-validator'
import { Gender } from '../../../../constants'

export class UserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[A-Z]).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter and one number'
  })
  readonly password: string

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'gender must be either male or female'
  })
  readonly gender: Gender
}
